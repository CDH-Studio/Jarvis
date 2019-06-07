'use strict';
const Room = use('App/Models/Room');
const User = use('App/Models/User');
const Building = use('App/Models/Building');
const Floor = use('App/Models/Floor');
const Tower = use('App/Models/Tower');
const RoomFeaturesCategory = use('App/Models/RoomFeaturesCategory');
const RoomFeature = use('App/Models/RoomFeature');
const FeaturePivot = use('App/Models/FeaturesRoomsPivot');
const RoomStatus = use('App/Models/RoomStatus');
const Review = use('App/Models/Review');
const Token = use('App/Models/Token');
const Helpers = use('Helpers');
const graph = require('@microsoft/microsoft-graph-client');
const Event = use('Event');

// Used for time related calcuklations and formatting
const moment = require('moment');
require('moment-round');

/**
 * Retrieve access token for Microsoft Graph from the data basebase.
 *
 * @returns {Object} The access token.
 *
 */
async function getAccessToken () {
	try {
		const results = await Token.findBy('type', 'access');
		const accessToken = results.toJSON().token;
		return accessToken;
	} catch (err) {
		console.log(err);
		return null;
	}
}

/**
 * Generating a random string.
 *
 * @param {Integer} times Each time a string of 5 to 6 characters is generated.
 */
function random (times) {
	let result = '';
	for (let i = 0; i < times; i++) {
		result += Math.random().toString(36).substring(2);
	}

	return result;
}

async function asyncForEach (arr, callback) {
	for (let i = 0; i < arr.length; i++) {
		await callback(arr[i], i, arr);
	}
}

async function asyncFilter (arr, callback) {
	let arr2 = [];

	for (let i = 0; i < arr.length; i++) {
		if (await callback(arr[i], i, arr)) {
			arr2.push(arr[i]);
		}
	}

	return arr2;
}

class RoomController {
	/**
	*
	* Render Search Room Page and pass the current time for autofill purposes
	*
	* @param {view}
	*
	*/
	async loadSearchRoomsForm ({ view, auth }) {
		// Calculates the from and too times to pre fill in the search form
		let fromTime = moment();
		let toTime = moment();
		let dropdownSelection = [];
		const start = moment().startOf('day');
		const end = moment().endOf('day');

		// round the autofill start and end times to the nearest 30mins
		fromTime = fromTime.round(30, 'minutes').format('HH:mm');
		toTime = toTime.round(30, 'minutes').add(1, 'h').format('HH:mm');

		// loop to fill the dropdown times
		while (start.isBefore(end)) {
			dropdownSelection.push({ dataValue: start.format('HH:mm'), name: start.format('h:mm A') });
			start.add(30, 'm');
		}

		return view.render('userPages.searchRooms', { fromTime, toTime, dropdownSelection });
	}
	/**
	 * Takes in a variable and converts the value to 0 if it's null (Used for checkboxes)
	 *
	 * @param {Object} variable The variable that will be converted
	 * @returns {Object} Returning converted variable if needed
	 *
	 */
	async convertCheckbox (variable) {
		if (variable === undefined) {
			variable = 0;
		}
		return variable;
	}

	async create ({ response, view, auth }) {
		const actionType = 'Add Room';

		const DBNameSelect = 'name_english as name';

		var formOptions = {};

		var results = await RoomStatus.query().select('id', 'name').fetch();
		formOptions.statuses = results.toJSON();
		results = await Floor.query().select('id', DBNameSelect).fetch();
		formOptions.floors = results.toJSON();
		results = await Tower.query().select('id', DBNameSelect).fetch();
		formOptions.towers = results.toJSON();
		results = await RoomFeaturesCategory
			.query()
			.with('features', (builder) => {
				builder.where('building_id', 1);
			})
			.select('id', DBNameSelect)
			.fetch();

		formOptions.roomFeatureCategory = results.toJSON();

		return view.render('adminPages.addEditRoom', { actionType, formOptions });
	}

	/**
	 * Adds a room Object into the Database.
	 *
	 * @param {Object} Context The context object.
	 */
	async add ({ request, response, session }) {
		try {
			// get building
			const selectedBuilding = request.cookie('selectedBuilding');
			const body = request.all();

			// Upload process - Floor Plan
			const floorPlanImage = request.file('floorPlan', {
				types: ['image'],
				size: '2mb'
			});

			// Upload process - Room Picture
			const roomImage = request.file('roomPicture', {
				types: ['image'],
				size: '2mb'
			});

			// Save room details in Rooms table
			const room = new Room();
			room.name = body.name;
			room.fullName = body.fullName;
			room.floor_id = body.floor;
			room.tower_id = body.tower;
			room.building_id = selectedBuilding.id;
			room.State_id = body.state;
			room.telephone = body.telephoneNumber;
			room.seats = body.tableSeats;
			room.capacity = body.maximumCapacity;
			room.avg_rating = 0;

			// Populates the room object's values
			room.floorplan = `uploads/floorPlans/${room.name}_floorPlan.png`;
			room.picture = `uploads/roomPictures/${room.name}_roomPicture.png`;
			room.extraEquipment = body.extraEquipment == null ? ' ' : body.extraEquipment;
			room.comment = body.comment == null ? ' ' : body.extraEquipment;
			await room.save();

			// Save room feature in pivot table
			const results = await RoomFeature.query().where('building_id', selectedBuilding.id).fetch();
			const roomFeatures = results.toJSON();

			for (var index = 0; index < roomFeatures.length; ++index) {
				if (body[roomFeatures[index].name_english]) {
					var feature = new FeaturePivot();
					feature.room_id = room.id;
					feature.room_feature_id = roomFeatures[index].id;
					feature.save();
				}
			}

			await floorPlanImage.move(Helpers.publicPath('uploads/floorPlans/'), {
				name: `${room.name}_floorPlan.png`
			});

			await roomImage.move(Helpers.publicPath('uploads/roomPictures/'), {
				name: `${room.name}_roomPicture.png`
			});

			session.flash({
				notification: 'Room Added! To add another room, click here',
				url: '/addRoom'
			});

			return response.route('showRoom', { id: room.id });
		} catch (err) {
			console.log(err);
			return response.redirect('/');
		}
	}

	/**
	 * Render a specific edit room page depending on the room Id.
	 *
	 * @param {Object} Context The context object.
	 */
	async edit ({ params, view }) {
		let DBNameSelect = 'name_english as name';

		// Retrieves room object
		var room = await Room.findBy('id', params.id);
		room.features = await FeaturePivot.query().where('room_id', room.id).pluck('room_feature_id');
		room = room.toJSON();

		const actionType = 'Edit Room';

		var formOptions = {};

		var results = await RoomStatus.query().select('id', 'name').fetch();
		formOptions.statuses = results.toJSON();
		results = await Floor.query().select('id', DBNameSelect).fetch();
		formOptions.floors = results.toJSON();
		results = await Tower.query().select('id', DBNameSelect).fetch();
		formOptions.towers = results.toJSON();
		results = await RoomFeaturesCategory
			.query()
			.with('features', (builder) => {
				builder.where('building_id', 1);
			})
			.select('id', DBNameSelect)
			.fetch();
		formOptions.roomFeatureCategory = results.toJSON();

		return view.render('adminPages.addEditRoom', { room, actionType, formOptions });
	}

	/**
	 * Updates a room object in the database.
	 *
	 * @param {Object} Context The context object.
	 */
	async update ({ request, session, params, response }) {
		// Retrieves room object
		let room = await Room.findBy('id', params.id);

		// Retrieves user input
		const body = request.all();

		// Upload process - Floor Plan
		const floorPlanImage = request.file('floorPlan', {
			types: ['image'],
			size: '2mb'
		});

		let floorPlanStringPath;
		if (floorPlanImage != null) {
			await floorPlanImage.move(Helpers.publicPath('uploads/floorPlans/'), {
				name: `${body.name}_floorPlan.png`,
				overwrite: true
			});
			floorPlanStringPath = `uploads/floorPlans/${body.name}_floorPlan.png`;
		} else {
			floorPlanStringPath = room.floorplan;
		}

		// Upload process - Room Picture
		const roomImage = request.file('roomPicture', {
			types: ['image'],
			size: '2mb'
		});

		let roomImageStringPath;
		if (roomImage != null) {
			await roomImage.move(Helpers.publicPath('uploads/roomPictures/'), {
				name: `${body.name}_roomPicture.png`,
				overwrite: true
			});
			roomImageStringPath = `uploads/roomPictures/${body.name}_roomPicture.png`;
		} else {
			roomImageStringPath = room.picture;
		}

		// Updates room information in database
		await Room
			.query()
			.where('id', room.id)
			.update({
				name: body.name,
				fullName: body.fullName,
				floor_id: body.floor,
				tower_id: body.tower,
				telephone: body.telephoneNumber,
				seats: body.tableSeats,
				capacity: body.maximumCapacity,
				floorplan: floorPlanStringPath,
				picture: roomImageStringPath,
				extraEquipment: body.extraEquipment == null ? ' ' : body.extraEquipment,
				comment: body.comment == null ? ' ' : body.comment,
				State_id: body.State_id
			});

		// save room features
		const selectedBuilding = request.cookie('selectedBuilding');

		const results = await RoomFeature.query().where('building_id', selectedBuilding.id).fetch();
		const roomFeatures = results.toJSON();

		// delete currently save room features
		await FeaturePivot
			.query()
			.where('room_id', room.id)
			.delete();

		// re-save selected room features
		var index;
		for (index = 0; index < roomFeatures.length; ++index) {
			if (body[roomFeatures[index].name_english]) {
				const feature = new FeaturePivot();
				feature.room_id = room.id;
				feature.room_feature_id = roomFeatures[index].id;
				feature.save();
			}
		}

		session.flash({ notification: 'Room Updated!' });

		return response.route('showRoom', { id: room.id });
	}

	/**
	 * Render a specific room details page depending on the room Id.
	 *
	 * @param {Object} Context The context object.
	 */
	async show ({ antl, response, auth, params, view, request }) {
		try {
			const result = await User.query().where('id', auth.user.id).with('role').firstOrFail();
			const user = result.toJSON();

			let DBNameSelect = 'name_english as name';

			if (antl.currentLocale() === 'fr') {
				DBNameSelect = 'name_french as name';
			}

			// get the search form date range if filled in, otherwise generate the data with current date
			const form = request.only(['date', 'from', 'to']);
			if (!form.date || form.date === 'undefined' || !form.from || form.from === 'undefined' || !form.to || form.to === 'undefined') {
				form.date = moment().format('YYYY-MM-DD');
				form.from = moment().round(30, 'minutes').format('HH:mm');
				form.to = moment().round(30, 'minutes').add(1, 'h').format('HH:mm');
			}

			// generating form for droptime times
			let dropdownSelection = [];
			const start = moment().startOf('day');
			const end = moment().endOf('day');

			// loop to fill the dropdown times
			while (start.isBefore(end)) {
				dropdownSelection.push({ dataValue: start.format('HH:mm'), name: start.format('h:mm A') });
				start.add(30, 'm');
			}

			var room = await Room.query()
				.where('id', params.id)
				.with('tower')
				.with('floor')
				.with('building')
				.firstOrFail();

			const hasReview = await this.hasRatingAndReview(auth.user.id, params.id);
			const review = await this.getRatingAndReview(auth.user.id, params.id);

			// retrieves all of the reviews associated to this room
			let reviewResults = await Review
				.query()
				.where('room_id', params.id)
				.with('user')
				.fetch();

			// retrieves all of the reviews associated to this room
			let reviewsCount = await Review
				.query()
				.where('room_id', params.id)
				.with('user')
				.getCount();

			var reviews = reviewResults.toJSON();

			for (var index = 0; index < reviewsCount; ++index) {
				var dd = Date.parse(reviews[index].created_at);
				reviews[index].comment_date = moment(dd).format('YYYY-MM-DD');
			}

			// Adds new attribute - rating - to every room object
			room.rating = await this.getAverageRating(room.id);

			var roomFeatures = await FeaturePivot
				.query()
				.where('room_id', room.id)
				.with('feature.category')
				.fetch();

			var roomFeatureCategory = await RoomFeaturesCategory
				.query()
				.select('id', DBNameSelect, 'icon')
				.fetch();

			roomFeatureCategory = roomFeatureCategory.toJSON();
			roomFeatures = roomFeatures.toJSON();
			room = room.toJSON();

			var selectedBuilding;
			var allBuildings;

			if (user.role.name === 'admin') {
				selectedBuilding = request.cookie('selectedBuilding');
				// get all builig info admin nav bar since this route is shared with regular users and admin
				// therefore, the admin middle-ware can't retrieve building info to pass to view
				allBuildings = await Building.all();
				allBuildings = allBuildings.toJSON();
			}

			return view.render('userPages.roomDetails', {
				id: params.id,
				room,
				user,
				form,
				hasReview,
				reviews,
				review,
				reviewsCount,
				dropdownSelection,
				roomFeatureCategory,
				roomFeatures,
				selectedBuilding,
				allBuildings
			});
		} catch (error) {
			console.log(error);
			return response.redirect('/');
		}
	}

	/**
	 * Query all the rooms from the database and render a page depending on the type of user.
	 *
	 * @param {Object} Context The context object.
	 */
	async getAllRooms ({ auth, view, request, response }) {
		var selectedBuilding;
		// get info of logged-in user
		const result = await User.query().where('id', auth.user.id).with('building').with('role').firstOrFail();
		const user = result.toJSON();

		// set building we are searching rooms in
		if (user.role.name === 'admin') {
			selectedBuilding = request.cookie('selectedBuilding');
			if (!selectedBuilding) {
				return response.route('viewSelectBuilding');
			}
		} else {
			selectedBuilding = user.building;
		}

		// find rooms
		let results = await Room
			.query()
			.where('building_id', selectedBuilding.id)
			.with('floor')
			.with('tower')
			.with('features', (builder) => {
				builder.orderBy('id', 'asc');
			})
			.fetch();

		const generateFloorAndTower = async () => {
			await asyncForEach(results.rows, async (item) => {
				item.floorName = (await item.floor().fetch()) === null ? 0 : (await item.floor().fetch()).name;
				item.towerName = (await item.tower().fetch()).name;
			});
		};

		await generateFloorAndTower();
		const rooms = results.toJSON();

		// Sort the results by name
		rooms.sort((a, b) => {
			return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
		});

		// if user is admin
		if (user.role.name === 'admin') {
			// Retrieve number of active rooms
			let countActive = await Room
				.query()
				.where('State_id', 1)
				.where('building_id', selectedBuilding.id)
				.count();

			// Retrieve number of deactive rooms
			let countDeactive = await Room
				.query()
				.where('State_id', 2)
				.where('building_id', selectedBuilding.id)
				.count();

			// Retrieve number of rooms under maintenance
			let countMaint = await Room
				.query()
				.where('State_id', 3)
				.where('building_id', selectedBuilding.id)
				.count();

			// Create statistic array with custom keys
			var stats = {};
			stats['total'] = rooms.length;
			stats['active'] = countActive[0]['count(*)'];
			stats['deactive'] = countDeactive[0]['count(*)'];
			stats['maintenance'] = countMaint[0]['count(*)'];

			// get all builig info admin nav bar since this route is shared with regular users and admin
			// therefore, the admin middle-ware can't retrieve building info to pass to view
			var allBuildings = await Building.all();
			allBuildings = allBuildings.toJSON();
			return view.render('adminPages.viewRooms', { rooms, stats, allBuildings, selectedBuilding });
		} else {
			return view.render('userPages.results', { rooms });
		}
	}

	/**
	 * Query the room from the database which matches the search input.
	 *
	 * @param {Object} Context The context object.
	 */
	async searchRooms ({ request, view }) {
		const form = request.all();
		const name = form.searchField;

		let searchResults = await Room
			.query()
			.where('name', name)
			.fetch();

		const rooms = searchResults.toJSON();

		return view.render('adminPages.viewRooms', { rooms });
	}

	/**
	 * Query rooms from search criteria and render the results page.
	 *
	 * @param {Object} Context The context object.
	 */
	async getSearchRooms ({ request, view }) {
		// importing forms from search form
		const form = request.all();
		const date = form.date;
		const from = form.from;
		const to = form.to;
		const location = form.location;
		const seats = form.seats;
		const capacity = form.capacity;
		// check boxes input
		let checkBox = [{ checkName: 1, checkValue: form.projectorCheck },
			{ checkName: 2, checkValue: form.whiteboardCheck },
			{ checkName: 3, checkValue: form.flipChartCheck },
			{ checkName: 4, checkValue: form.audioCheck },
			{ checkName: 5, checkValue: form.videoCheck },
			{ checkName: 6, checkValue: form.surfaceHubCheck },
			{ checkName: 7, checkValue: form.pcCheck }
		];
		// only loook for roosm that are open
		let searchResults = Room
			.query()
			.where('State_id', 1)
			.clone();

		// if the location is selected then query, else dont
		// TODO: floor_id -> floorName
		if (location !== 'undefined') {
			searchResults = searchResults
				.where('floor_id', location)
				.clone();
		}
		// if the "number of seats" is selected then add to query, else ignore it
		if (seats) {
			searchResults = searchResults
				.where('seats', '>=', seats)
				.clone();
		}

		// if the "number of people" is selected then add to query, else ignore it
		if (capacity) {
			searchResults = searchResults
				.where('capacity', '>=', capacity)
				.clone();
		}

		// // loop through the array of objects and add to query if checked
		// for (let i = 0; i < checkBox.length; i++) {
		// 	if (checkBox[i].checkValue === '1') {
		// 		searchResults = searchResults
		// 			// .where('features.id', checkBox[i].checkName)
		// 			.where(checkBox[i].checkName, checkBox[i].checkValue)
		// 			.clone();
		// 	}
		// }

		// Features filter
		const filter = checkBox
			.filter(x => x.checkValue === '1')
			.map(x => x.checkName);

		// fetch the query
		let rooms = (await searchResults.with('features').fetch()).rows;

		const filterFeatures = async (rooms, feat) => {
			return asyncFilter(rooms, async (room) => {
				const feats = (await room.features().fetch()).toJSON();
				// console.log(room.name, feats.map(x => x.name_english));
				// console.log(feat, feats.find(x => x.id == feat) === null)
				// console.log(feats.find(x => x.id === feat))
				return feats.find(x => x.id === feat);
			});
		};
		const forEveryFeature = async () => {
			await asyncForEach(filter, async (feat) => {
				rooms = await filterFeatures(rooms, feat);
			})
		};

		await forEveryFeature();

		// Sets average rating for each room
		for (var i = 0; i < rooms.length; i++) {
			// Adds new attribute - rating - to every room object
			rooms[i].rating = await this.getAverageRating(rooms[i].id);
		}

		// iterate through the rooms
		const code = random(4);
		const checkRoomAvailability = async () => {
			let results = [];

			await asyncForEach(rooms, async (item) => {
				if (await this.getRoomAvailability(date, from, to, item.calendar)) {
					item.floorName = (await item.floor().fetch()) === null ? 0 : (await item.floor().fetch()).name;
					item.towerName = (await item.tower().fetch()).name;
					item = item.toJSON();
					item.featureNames = item.features.map(f => {
						return {name_english: f.name_english, name_french: f.name_french};
					})
					console.log(item.featureNames)
					Event.fire('send.room', {
						card: view.render('components.card', { form, room: item, token: request.csrfToken }),
						code: code
					});

					results.push(item);
				}
			});

			Event.fire('send.done', {
				code: code
			});

			if (results.length === 0) {
				Event.fire('send.empty', {
					code: code
				});
			}
		};

		setTimeout(checkRoomAvailability, 500);

		// Sort the results by name
		rooms.sort((a, b) => {
			return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
		});

		return view.render('userPages.searchResults', { code: code });
	}

	/**
	 * Query all events of the specified room calendar.
	 *
	 * @param {String} calendarId The id of the room calendar.
	 */
	async getEvents (calendarId) {
		const accessToken = await getAccessToken();

		if (accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const events = await client
					.api(`/me/calendars/${calendarId}/events`)
					.select('subject,organizer,start,end')
					// .orderby('createdDateTime DESC')
					.get();

				return events;
			} catch (err) {
				console.log(err);
			}
		}
	}

	/**
	 * Query all the room calendars.
	 */
	async getCalendars () {
		const accessToken = await getAccessToken();

		if (accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const calendars = await client
					.api('/me/calendars?top=100')
					// .orderby('createdDateTime DESC')
					.get();

				return calendars;
			} catch (err) {
				console.log(err);
			}
		}
	}

	/**
	 * Query the specified room calendar.
	 *
	 * @param {String} calendarId The id of the room calendar.
	 */
	async getCalendar (calendarId) {
		const accessToken = await getAccessToken();

		if (accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const calendar = await client
					.api(`/me/calendars/${calendarId}`)
					// .orderby('createdDateTime DESC')
					.get();

				return calendar;
			} catch (err) {
				console.log(err);
			}
		}
	}

	async getCalendarView (calendarId, start, end) {
		const accessToken = await getAccessToken();

		if (accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const calendarView = await client
					.api(`/me/calendars/${calendarId}/calendarView?startDateTime=${start}&endDateTime=${end}`)
					// .orderby('start DESC')
					.header('Prefer', 'outlook.timezone="Eastern Standard Time"')
					.get();

				return calendarView;
			} catch (err) {
				console.log(err);
			}
		}
	}

	/**
	 *
	 * @param {String} date     Date
	 * @param {String} from     Starting time
	 * @param {String} to       Ending time
	 * @param {String} calendar Calendar ID
	 *
	 * @returns {Boolean} Whether or not the room is available
	 */
	async getRoomAvailability (date, from, to, calendar) {
		const startTime = date + 'T' + from;
		const endTime = date + 'T' + to;

		// if there is a calendar for the room
		if (calendar !== 'insertCalendarHere' && calendar !== null) {
			// query the events within the search time range
			const calendarViews = (await this.getCalendarView(
				calendar,
				startTime,
				endTime
			)).value;

			// if event end time is the same as search start time, remove the event
			calendarViews.forEach((item, index, items) => {
				const eventEndTime = new Date(item.end.dateTime);
				const searchStartTime = new Date(startTime);

				if (+eventEndTime === +searchStartTime) {
					items.splice(index, 1);
				}
			});

			return calendarViews.length === 0;
		}
	}

	/**
	 * Calcualtes the average rating of a specific room, based off of the room Id
	 *
	 * @param {Object} Context The context object.
	 */
	async getAverageRating (roomId) {
		try {
			// Retrive all the ratings and calculates the average
			let searchResults = await Review
				.query()
				.where('room_id', roomId)
				.avg('rating');

			// If there is no averge rating, return 'No Rating'
			if (searchResults[0]['avg(`rating`)'] == null) {
				return 'No Rating';
			}

			// Returns the rating, thus searchResults[0]['avg(`rating`)']
			return searchResults[0]['avg(`rating`)'];
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * Returns true if the user has a review in the database, else false.
	 *
	 * @param {Object} Context The context object.
	 */
	async hasRatingAndReview (userId, roomId) {
		try {
			// Retrive all the reviews associated to a specific user
			let searchResults = await Review
				.query()
				.where('user_id', userId)
				.where('room_id', roomId)
				.fetch();

			const reviews = searchResults.toJSON();

			// return true if the user has a review, else false
			return reviews.length > 0;
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * Returns a user's review for a specific room
	 *
	 * @param {Object} Context The context object.
	 */
	async getRatingAndReview (userId, roomId) {
		try {
			// Retrive all the reviews associated to a specific user
			let searchResults = await Review
				.query()
				.where('user_id', userId)
				.where('room_id', roomId)
				.fetch();

			const reviews = searchResults.toJSON();

			// returns a user's review for a specific room
			return reviews[0];
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = RoomController;
