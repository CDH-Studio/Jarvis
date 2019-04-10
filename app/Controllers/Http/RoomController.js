'use strict';
const Room = use('App/Models/Room');
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
		toTime = toTime.round(30, 'minutes').add(1, 'h').format('hh:mm');

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
		return view.render('adminPages.addEditRoom', { actionType });
	}

	/**
	 * Adds a room Object into the Database.
	 *
	 * @param {Object} Context The context object.
	 */
	async add ({ request, response, session }) {
		try {
			// Retrieves user input
			const body = request.all();

			// Populates the room object's values
			const room = new Room();
			room.name = body.name;
			room.fullName = body.fullName;
			room.floor = body.floor;
			room.tower = body.tower;
			room.state = body.state;
			room.telephone = body.telephoneNumber;
			room.seats = body.tableSeats;
			room.capacity = body.maximumCapacity;
			room.projector = body.projectorCheck === '1' ? '1' : '0';
			room.whiteboard = body.whiteboardCheck === '1' ? '1' : '0';
			room.flipchart = body.flipChartCheck === '1' ? '1' : '0';
			room.audioConference = body.audioCheck === '1' ? '1' : '0';
			room.videoConference = body.videoCheck === '1' ? '1' : '0';
			room.surfaceHub = body.surfaceHubCheck === '1' ? '1' : '0';
			room.pc = body.pcCheck === '1' ? '1' : '0';
			// Upload process - Floor Plan
			const floorPlanImage = request.file('floorPlan', {
				types: ['image'],
				size: '2mb'
			});
			await floorPlanImage.move(Helpers.publicPath('uploads/floorPlans/'), {
				name: `${room.name}_floorPlan.png`
			});

			// Upload process - Room Picture
			const roomImage = request.file('roomPicture', {
				types: ['image'],
				size: '2mb'
			});
			await roomImage.move(Helpers.publicPath('uploads/roomPictures/'), {
				name: `${room.name}_roomPicture.png`
			});

			// Populates the room object's values
			room.floorplan = `uploads/floorPlans/${room.name}_floorPlan.png`;
			room.picture = `uploads/roomPictures/${room.name}_roomPicture.png`;
			room.extraEquipment = body.extraEquipment == null ? ' ' : body.extraEquipment;
			room.comment = body.comment == null ? ' ' : body.extraEquipment;
			await room.save();

			session.flash({
				notification: 'Room Added! To add another room, click here',
				url: '/addRoom'
			});

			return response.route('showRoom', { id: room.id });
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * Render a specific edit room page depending on the room Id.
	 *
	 * @param {Object} Context The context object.
	 */
	async edit ({ params, view }) {
		// Retrieves room object
		const room = await Room.findBy('id', params.id);
		const actionType = 'Edit Room';
		return view.render('adminPages.addEditRoom', { room: room, actionType });
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
		await floorPlanImage.move(Helpers.publicPath('uploads/floorPlans/'), {
			name: `${body.name}_floorPlan.png`,
			overwrite: true
		});

		// Upload process - Room Picture
		const roomImage = request.file('roomPicture', {
			types: ['image'],
			size: '2mb'
		});
		await roomImage.move(Helpers.publicPath('uploads/roomPictures/'), {
			name: `${body.name}_roomPicture.png`,
			overwrite: true
		});
		// Updates room information in database
		await Room
			.query()
			.where('name', room.name)
			.update({
				name: body.name,
				fullName: body.fullName,
				floor: body.floor,
				tower: body.tower,
				telephone: body.telephoneNumber,
				seats: body.tableSeats,
				capacity: body.maximumCapacity,
				projector: body.projectorCheck === '1' ? '1' : '0',
				whiteboard: body.whiteboardCheck === '1' ? '1' : '0',
				flipchart: body.flipChartCheck === '1' ? '1' : '0',
				audioConference: body.audioCheck === '1' ? '1' : '0',
				videoConference: body.videoCheck === '1' ? '1' : '0',
				surfaceHub: body.surfaceHubCheck === '1' ? '1' : '0',
				pc: body.pcCheck === '1' ? '1' : '0',
				floorplan: `uploads/floorPlans/${body.name}_floorPlan.png`,
				picture: `uploads/roomPictures/${body.name}_roomPicture.png`,
				extraEquipment: body.extraEquipment == null ? ' ' : body.extraEquipment,
				comment: body.comment == null ? ' ' : body.comment,
				state: body.state
			});
		room = await Room.findBy('name', body.name);
		session.flash({ notification: 'Room Updated!' });

		return response.route('showRoom', { id: room.id });
	}

	/**
	 * Render a specific room details page depending on the room Id.
	 *
	 * @param {Object} Context The context object.
	 */
	async show ({ response, auth, params, view, request }) {
		try {
			// get the search form data if employee view
			const form = request.only(['date', 'from', 'to']);
			const room = await Room.findOrFail(params.id);
			const userRole = await auth.user.getUserRole();
			const hasReview = await this.hasRatingAndReview(auth.user.id, params.id);
			const review = await this.getRatingAndReview(auth.user.id, params.id);

			var isAdmin = 0;
			// if user is admin
			if (userRole === 'admin') {
				isAdmin = 1;
				// check if user is viewing their own profile
			} else if (userRole === 'user') {
				isAdmin = 0;
				// check if user is viewing someone elses profile
			} else {
				return response.redirect('/');
			}

			// retrieves all of the reviews associated to this room
			let searchResults = await Review
				.query()
				.where('room_id', params.id)
				.fetch();

			const reviews = searchResults.toJSON();

			// Adds new attribute - rating - to every room object
			room.rating = await this.getAverageRating(room.id);

			return view.render('userPages.roomDetails', { id: params.id, room, isAdmin, form, hasReview, reviews, review });
		} catch (error) {
			return response.redirect('/');
		}
	}

	/**
	 * Query all the rooms from the database and render a page depending on the type of user.
	 *
	 * @param {Object} Context The context object.
	 */
	async getAllRooms ({ auth, view }) {
		const results = await Room.all();
		const rooms = results.toJSON();
		const userRole = await auth.user.getUserRole();

		// Sort the results by name
		rooms.sort((a, b) => {
			return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
		});

		// Retrieve number of active rooms
		let countActive = await Room
			.query()
			.where('state', 1)
			.count();

		// Retrieve number of deactive rooms
		let countDeactive = await Room
			.query()
			.where('state', 2)
			.count();

		// Retrieve number of rooms under maintenance
		let countMaint = await Room
			.query()
			.where('state', 3)
			.count();

		// Create statistic array with custom keys
		var stats = {};
		stats['total'] = rooms.length;
		stats['active'] = countActive[0]['count(*)'];
		stats['deactive'] = countDeactive[0]['count(*)'];
		stats['maintenance'] = countMaint[0]['count(*)'];

		// Sets average rating for each room
		for (var i = 0; i < rooms.length; i++) {
			// Adds new attribute - rating - to every room object
			rooms[i].rating = await this.getAverageRating(rooms[i].id);
		}

		// if user is admin
		if (userRole === 'admin') {
			return view.render('adminPages.viewRooms', { rooms, stats });
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

		return view.render('adminDash.viewRooms', { rooms });
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
		let checkBox = [{ checkName: 'projector', checkValue: form.projectorCheck },
			{ checkName: 'whiteboard', checkValue: form.whiteboardCheck },
			{ checkName: 'flipchart', checkValue: form.flipChartCheck },
			{ checkName: 'audioConference', checkValue: form.audioCheck },
			{ checkName: 'videoConference', checkValue: form.videoCheck },
			{ checkName: 'surfaceHub', checkValue: form.surfaceHubCheck },
			{ checkName: 'pc', checkValue: form.pcCheck }
		];
		// only loook for roosm that are open
		let searchResults = Room
			.query()
			.where('state', 1)
			.clone();

		// if the location is selected then query, else dont
		if (location !== 'undefined') {
			searchResults = searchResults
				.where('floor', location)
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

		// loop through the array of objects and add to query if checked
		for (let i = 0; i < checkBox.length; i++) {
			if (checkBox[i].checkValue === '1') {
				searchResults = searchResults
					.where(checkBox[i].checkName, checkBox[i].checkValue)
					.clone();
			}
		}
		// fetch the query
		searchResults = await searchResults.fetch();

		const rooms = searchResults.toJSON();

		// Sets average rating for each room
		for (var i = 0; i < rooms.length; i++) {
			// Adds new attribute - rating - to every room object
			rooms[i].rating = await this.getAverageRating(rooms[i].id);
		}

		// iterate through the rooms
		async function asyncForEach (arr, callback) {
			for (let i = 0; i < arr.length; i++) {
				await callback(arr[i], i, arr);
			}
		}

		const code = random(4);
		const checkRoomAvailability = async () => {
			let results = [];
			let hasResults = false;

			await asyncForEach(rooms, async (item) => {
				if (await this.getRoomAvailability(date, from, to, item.calendar)) {
					if (!hasResults) {
						Event.fire('send.hasResults', {
							code: code
						});
						hasResults = true;
					}
					Event.fire('send.room', {
						card: view.render('components.card', { form, room: item, token: request.csrfToken }),
						code: code
					});

					results.push(item);
				}
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
