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
const Helpers = use('Helpers');
const Event = use('Event');
const Outlook = new (use('App/Outlook'))();
const SearchRecord = use('App/Models/SearchRecord');

// Used for time related calcuklations and formatting
const moment = require('moment');
require('moment-recur');
require('moment-round');

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
			const sharp = require('sharp');
			// get building
			const selectedBuilding = request.cookie('selectedBuilding');
			const body = request.all();

			let floorPlanStringPath, floorPlanStringPathSmall;

			// Upload process - Floor Plan
			const floorPlanImage = request.file('floorPlan', {
				types: ['image'],
				size: '2mb'
			});

			if (floorPlanImage) {
				await floorPlanImage.move(Helpers.publicPath('uploads/imageBuffer/'), {
					name: `${body.name}_floorPlan_temp.png`,
					overwrite: true
				});

				floorPlanStringPath = `uploads/floorPlans/${body.name}_floorPlan.jpg`;
				floorPlanStringPathSmall = `uploads/floorPlans/${body.name}_floorPlan_small.jpg`;

				await sharp(Helpers.publicPath(`uploads/imageBuffer/${body.name}_floorPlan_temp.png`))
					.resize({ height: 500 })
					.jpeg({
						quality: 90,
						chromaSubsampling: '4:4:4'
					})
					.toFile(Helpers.publicPath(floorPlanStringPath));

				await sharp(Helpers.publicPath(`uploads/imageBuffer/${body.name}_floorPlan_temp.png`))
					.resize({ height: 150 })
					.jpeg({
						quality: 80,
						chromaSubsampling: '4:4:4'
					})
					.toFile(Helpers.publicPath(floorPlanStringPathSmall));
			} else {
				floorPlanStringPath = 'images/temp_floor_map.jpg';
				floorPlanStringPathSmall = 'images/temp_floor_map.jpg';
			}

			// Upload process - Room Picture
			const roomImage = request.file('roomPicture', {
				types: ['image'],
				size: '3mb'
			});

			let roomImageStringPath, roomImageStringPathSmall;

			if (roomImage) {
				await roomImage.move(Helpers.publicPath('uploads/imageBuffer/'), {
					name: `${body.name}_roomPicture_temp.png`,
					overwrite: true
				});

				roomImageStringPath = `uploads/roomPictures/${body.name}_roomPicture.jpg`;
				roomImageStringPathSmall = `uploads/roomPictures/${body.name}_roomPicture_small.jpg`;

				// Convert any input to very high quality JPEG output
				await sharp(Helpers.publicPath(`uploads/imageBuffer/${body.name}_roomPicture_temp.png`))
					.resize({ height: 500 })
					.jpeg({
						quality: 90,
						chromaSubsampling: '4:4:4'
					})
					.toFile(Helpers.publicPath(roomImageStringPath));

				// Convert any input to very high quality JPEG output
				await sharp(Helpers.publicPath(`uploads/imageBuffer/${body.name}_roomPicture_temp.png`))
					.resize({ height: 150 })
					.jpeg({
						quality: 80,
						chromaSubsampling: '4:4:4'
					})
					.toFile(Helpers.publicPath(roomImageStringPathSmall));
			} else {
				roomImageStringPath = 'images/temp_room_image.jpg';
				roomImageStringPathSmall = 'images/temp_room_image.jpg';
			}

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
			room.floorplan = floorPlanStringPath;
			room.floorplan_small = floorPlanStringPathSmall;
			room.picture = roomImageStringPath;
			room.picture_small = roomImageStringPathSmall;
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
		const sharp = require('sharp');

		// Retrieves room object
		let room = await Room.findBy('id', params.id);

		// Retrieves user input
		const body = request.all();

		// Upload process - Floor Plan
		const floorPlanImage = request.file('floorPlan', {
			types: ['image'],
			size: '3mb'
		});

		let floorPlanStringPath, floorPlanStringPathSmall;

		// if user uploaded new floor plan then save
		if (floorPlanImage != null) {
			await floorPlanImage.move(Helpers.publicPath('uploads/imageBuffer/'), {
				name: `${body.name}_floorPlan_temp.png`,
				overwrite: true
			});

			floorPlanStringPath = `uploads/floorPlans/${body.name}_floorPlan.jpg`;
			floorPlanStringPathSmall = `uploads/floorPlans/${body.name}_floorPlan_small.jpg`;

			await sharp(Helpers.publicPath(`uploads/imageBuffer/${body.name}_floorPlan_temp.png`))
				.resize({ height: 500 })
				.jpeg({
					quality: 90,
					chromaSubsampling: '4:4:4'
				})
				.toFile(Helpers.publicPath(floorPlanStringPath));

			// Convert any input to very high quality JPEG output
			await sharp(Helpers.publicPath(`uploads/imageBuffer/${body.name}_floorPlan_temp.png`))
				.resize({ height: 150 })
				.jpeg({
					quality: 80,
					chromaSubsampling: '4:4:4'
				})
				.toFile(Helpers.publicPath(floorPlanStringPathSmall));

		// if no image is uploaded and no image has been previously saved on server
		} else if (room.floorplan === null && floorPlanImage === null) {
			floorPlanStringPath = 'images/temp_floor_map.jpg';
			floorPlanStringPathSmall = 'images/temp_floor_map.jpg';

		// if no image was uploaded but there is a previously save image
		} else {
			floorPlanStringPath = room.floorplan;
			floorPlanStringPathSmall = room.floorplan_small;
		}

		// Upload process - Room Picture
		const roomImage = request.file('roomPicture', {
			types: ['image'],
			size: '3mb'
		});

		let roomImageStringPath, roomImageStringPathSmall;

		// if user uploaded new floor plan then save
		if (roomImage != null) {
			await roomImage.move(Helpers.publicPath('uploads/imageBuffer/'), {
				name: `${body.name}_roomPicture_temp.png`,
				overwrite: true
			});

			roomImageStringPath = `uploads/roomPictures/${body.name}_roomPicture.jpg`;
			roomImageStringPathSmall = `uploads/roomPictures/${body.name}_roomPicture_small.jpg`;

			// Convert any input to very high quality JPEG output
			await sharp(Helpers.publicPath(`uploads/imageBuffer/${body.name}_roomPicture_temp.png`))
				.resize({ height: 500 })
				.jpeg({
					quality: 90,
					chromaSubsampling: '4:4:4'
				})
				.toFile(Helpers.publicPath(roomImageStringPath));

			// Convert any input to very high quality JPEG output
			await sharp(Helpers.publicPath(`uploads/imageBuffer/${body.name}_roomPicture_temp.png`))
				.resize({ height: 150 })
				.jpeg({
					quality: 80,
					chromaSubsampling: '4:4:4'
				})
				.toFile(Helpers.publicPath(roomImageStringPathSmall));

		// if no image is uploaded and no image has been previously saved on server
		} else if (room.picture === null && floorPlanImage === null) {
			roomImageStringPath = 'images/temp_room_image.jpg';
			roomImageStringPathSmall = 'images/temp_room_image.jpg';

		// if no image was uploaded but there is a previously save image
		} else {
			roomImageStringPath = room.picture;
			roomImageStringPathSmall = room.picture_small;
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
				floorplan_small: floorPlanStringPathSmall,
				picture: roomImageStringPath,
				picture_small: roomImageStringPathSmall,
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
		let selectedBuilding;
		// get info of logged-in user
		let result = await User.query().where('id', auth.user.id).with('building').with('role').firstOrFail();
		const user = result.toJSON();
		let floors = [];

		// set building we are searching rooms in
		if (user.role.name === 'admin') {
			selectedBuilding = request.cookie('selectedBuilding');
			if (!selectedBuilding) {
				return response.route('viewSelectBuilding');
			}
		} else {
			selectedBuilding = user.building;
		}

		// if user is admin
		if (user.role.name === 'admin') {
			// find rooms
			result = await Room
				.query()
				.where('building_id', selectedBuilding.id)
				.with('floor')
				.with('tower')
				.with('features', (builder) => {
					builder.orderBy('id', 'asc');
				})
				.fetch();
		} else {
			// find rooms
			result = await Room
				.query()
				.where('building_id', selectedBuilding.id)
				.where('State_id', 1)
				.with('floor')
				.with('tower')
				.with('features', (builder) => {
					builder.orderBy('id', 'asc');
				})
				.fetch();

			floors = (await Floor.all()).toJSON();
		}

		const rooms = result.toJSON();

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
			return view.render('userPages.allRooms', { floors, rooms });
		}
	}

	async flexibleSearchRooms ({ request, view, response, antl, auth }) {
		const options = request.all();
		
		this.saveSearchRecord({ userId: auth.user.id, type: 'flexible' });

		let timeSlots = [];
		// Generate randome code for pusher
		const code = random(4);
		let rooms = (await Room.filterRooms(options.flexibleSearchFloor, options.flexibleSearchSeats, options.flexibleSearchCapacity, options.flexibleSearchFeatures)).toJSON();

		if (rooms.length) {
			// calculate duration of meeting
			const timeframeStart = moment(options.flexibleSearchFrom, 'HH:mm');
			const timeframeEnd = moment(options.flexibleSearchTo, 'HH:mm');
			const meetingDuration = Number(options.flexibleSearchDuration) * 60;

			// IMPORTANT: ensure meeting duration is more than 0 min
			if (meetingDuration <= 0) {
				response.route('home');
			}

			// Calculate time intervals
			let timeStepStart = timeframeStart;
			let end = 0;

			// generate all time queries for possible meeting times within time frame
			do {
				// set start and end time of meeting
				let start = timeStepStart.clone();
				end = start.clone();
				end.add(meetingDuration, 'm').format('HH:mm');
				timeSlots.push({ start: start.format('HH:mm'), end: end.format('HH:mm'), startID: start.format('HHmm') });
				// add 30 min for next possible time frame
				timeStepStart.add(30, 'm');
			} while (timeframeEnd.diff(end, 'minutes') >= meetingDuration);

			Room.FlexibleSearchRoomsByTime({ timeSlots: timeSlots, rooms: rooms, options: options, csrfToken: request.csrfToken, code: code, antl: antl });
		}

		return view.render('userPages.flexibleSearchResults', { code: code, roomsLength: rooms.length, timeSlots: timeSlots });
	}

	/**
	 * Query rooms from search criteria and render the results page.
	 *
	 * @param {Object} Context The context object.
	 */
	async fixedSearchRooms ({ request, view, antl, auth }) {
		// importing forms from search form
		const options = request.all();
		
		this.saveSearchRecord({ userId: auth.user.id, type: 'fixed' });

		let rooms = (await Room.filterRooms(options.fixedSearchFloor, options.fixedSearchSeats, options.fixedSearchCapacity, options.fixedSearchFeatures)).toJSON();

		// calculate duration of meeting
		const fromFormated = moment(options.fixedSearchFrom, 'HH:mm');
		const toFormated = moment(options.fixedSearchTo, 'HH:mm');
		options.duration = toFormated.diff(fromFormated, 'minutes');

		// Generate randome code for pusher
		const code = random(4);
		let floors = [];

		if (rooms.length) {
			// search room availability and push to results page
			Room.FixedSearchRoomsBy({ antl: antl, rooms: rooms, options: options, csrfToken: request.csrfToken, code: code, view: view });
			// load floors
			floors = (await Floor.all()).toJSON();
		}

		return view.render('userPages.fixedSearchResults', { code: code, roomsLength: rooms.length, floors: floors });
	}

	async saveSearchRecord({ userId, type }) {
		const record = new SearchRecord();
		record.user_id = userId;
		record.type = type;
		record.save();
	}

	/**
	*
	* Retrieve currently available rooms and returns and array of size 2 with results
	* User's Floor and Tower > User's Floor and ¬ Tower > User's Floor-1 and Tower > User's Floor+1 and Tower > User's Floor-1 and ¬ Tower
	*
	* @param {view}
	*
	*/
	async currentlyAvailable ({ antl, view, request }) {
		try {
			const body = request.all();
			// check if user is valid
			let user = await User.findByOrFail('id', body.user_id);
			let code = body.code;

			// If the tower is West then set the order to descending, else ascending
			let towerOrder = (await user.getUserTower() === 'West') ? 'asc' : 'desc';
			let lang = antl.currentLocale();

			// format date
			const now = moment();
			const remainder = 30 - (now.minute() % 30);
			const date = moment().format('YYYY-MM-DD');
			const from = moment(now).add(remainder, 'm').format('HH:mm');
			const to = moment(now).add(remainder, 'm').add(1, 'h').format('HH:mm');
			const duration = 1;

			let formattedFrom, formattedTo;

			const formattedDate = moment().locale(lang).format('ddd MMM DD, YYYY');
			if (lang === 'fr') {
				formattedFrom = moment(now).add(remainder, 'm').format('HH:mm');
				formattedTo = moment(now).add(remainder, 'm').add(1, 'h').format('HH:mm');
			} else {
				formattedFrom = moment(now).add(remainder, 'm').format('h:mm A');
				formattedTo = moment(now).add(remainder, 'm').add(1, 'h').format('h:mm A');
			}

			// look for rooms that are open
			// order all rooms in the database by closest to the user's floor and tower
			// order by ascending seats number and fetch results
			let searchResults = await Room
				.query()
				.where('state_id', 1)
				.orderByRaw('ABS(floor_id-' + user.floor_id + ') ASC')
				.orderBy('tower_id', towerOrder)
				.orderBy('seats', 'asc')
				.fetch();
			const rooms = searchResults.toJSON();

			// Search for rooms
			let numberOfRooms = 2;
			let roomsSearched = 0;
			await rooms.forEach(async room => {
				// check availability of room
				let result = await Outlook.getRoomAvailability({ date, from, to, duration, floor: room.floor_id, calendar: room.calendar });
				if (numberOfRooms !== 0 && result) {
					Event.fire('send.room', {
						card: view.render('components.smallCard', { room: room, datetime: { date: formattedDate, time: formattedFrom + ' - ' + formattedTo } }),
						code: code
					});
					numberOfRooms--;
				}

				roomsSearched++;

				// once 2 rooms are found or searched all rooms then send END sifnal
				if (numberOfRooms === 0 || rooms.length === roomsSearched) {
					Event.fire('send.done', {
						code: code
					});
				}
			});
		} catch (error) {
			console.log(error);
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

	/**
	* Query all the room calendars.
	*/
	async getCalendars () {
		return Outlook.getCalendars();
	}

	/**
	* Query the specified room calendar.
	*
	* @param {String} calendarId The id of the room calendar.
	*/
	async getCalendar (calendarId) {
		return Outlook.getCalendar(calendarId);
	}
}

module.exports = RoomController;
