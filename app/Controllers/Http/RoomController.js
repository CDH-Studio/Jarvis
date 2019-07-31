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
const Env = use('Env');
const Event = use('Event');
const Outlook = new (use('App/Outlook'))();

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

async function asyncMap (arr, callback) {
	let arr2 = [];

	for (let i = 0; i < arr.length; i++) {
		arr2.push(await callback(arr[i], i, arr));
	}

	return arr2;
}

// iterate through the rooms
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
	async loadSearchRoomsForm ({ view, params }) {
		// Calculates the from and too times to pre fill in the search form
		let fromTime = moment();
		let toTime = moment();
		let dropdownSelection = [];
		const start = moment().startOf('day');
		const end = moment().endOf('day');
		const endBy = moment().startOf('day').add(1, 'month').format('YYYY-MM-DD');

		// round the autofill start and end times to the nearest 30mins
		fromTime = fromTime.round(30, 'minutes').format('HH:mm');
		toTime = toTime.round(30, 'minutes').add(1, 'h').format('HH:mm');

		// loop to fill the dropdown times
		while (start.isBefore(end)) {
			dropdownSelection.push({ dataValue: start.format('HH:mm'), name: start.format('h:mm A') });
			start.add(30, 'm');
		}

		return view.render(`userPages.${params.view}`, { fromTime, toTime, dropdownSelection, endBy });
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
		let selectedBuilding;
		// get info of logged-in user
		let result = await User.query().where('id', auth.user.id).with('building').with('role').firstOrFail();
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
			return view.render('userPages.results', { rooms });
		}
	}

	async searchRooms ({ request, view }) {
		const options = request.all();
		console.log(options.to + '-' + options.from);

		if (!options.to) {
			return this.findSpecific({ request, view });
		} else {
			return this.findAvailable({ request, view });
		}
	}

	async findAvailable ({ request, view }) {
		const options = request.all();
		const { rooms, features } = await this.filterRooms(options);

		const duration = Number(options.hour) * 60;
		let results = {};

		if (Env.get('DEV_OUTLOOK', 'prod') !== 'prod') {
			results = { '0ASIS': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '101A (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '13:30', '14:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '101B (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '12:00', '12:30', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '105A (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '12:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '145A (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '165A (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '174A (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '12:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '199C (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'], '231A (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '12:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '243A (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '11:00', '11:30', '12:00', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '255D (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '12:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '259A (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '12:00', '12:30', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '298B (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '299A (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '331A (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '353A (W)': ['16:00'], '398C (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '398B (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '399B (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '3E Lobby': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '12:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '3W Lobby': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '12:00', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '401A (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '12:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '401B (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '12:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '402A (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '551A (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '567A (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '5W Lobby': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '645C (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '12:00', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '660F (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '7E Lobby': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '12:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '7W Lobby': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '12:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '741F (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '12:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '752A (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '799A (W)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '12:00', '12:30', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '831D (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '11:00', '11:30', '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '902A (E)': ['08:00', '08:30', '11:30', '12:00', '15:30', '16:00'], '903A (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '12:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '903B (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '12:00', '14:00', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '921D (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '11:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '921E (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '11:30', '12:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], '949A (E)': ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '12:30', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'] };
		} else {
			const find = async () => {
				await asyncForEach(rooms, async (item) => {
					results[item.name] = await Outlook
						.findAvail({
							room: item.calendar,
							start: moment(options.date).format('YYYY-MM-DDTHH:mm'),
							end: moment(options.date).add(24, 'hour').format('YYYY-MM-DDTHH:mm'),
							duration,
							floor: item.floor_id
						});
				});
			};

			await find();
		}

		let times = [];
		for (const name in results) {
			let room = results[name];
			room = room.filter(item => {
				const time = moment(item, 'HH:mm');
				const min = moment(options.from, 'HH:mm');
				const max = moment(options.to, 'HH:mm');

				return (time >= min && time <= max);
			});

			// item: a starting time for a room
			const generateTimes = async () => {
				await asyncForEach(room, async (item) => {
					if (!times[item]) {
						times[item] = {};
						times[item].rooms = [];
						times[item].from = item;
						times[item].time = moment(item, 'HH:mm').format('h:mm A');
						times[item].to = moment(item, 'HH:mm').add(duration, 'minutes').format('HH:mm');
						times[item].id = 'tab' + moment(item, 'HH:mm').format('HHmm');
					}

					let newRoom = {};
					newRoom.room = rooms.find(r => { return r.name === name; });
					const floorObj = (await newRoom.room.floor().fetch()) === null ? { name_english: 0, name_french: 0 } : (await newRoom.room.floor().fetch()).toJSON();
					const towerObj = (await newRoom.room.tower().fetch()).toJSON();
					newRoom.room.floor = floorObj;
					newRoom.room.tower = towerObj;
					newRoom.room = newRoom.room.toJSON();
					newRoom.from = times[item].from;
					newRoom.to = times[item].to;
					times[item].rooms.push(newRoom);
				});
			};

			await generateTimes();
		}
		times = Object.values(times);
		times.sort((a, b) => {
			return (a.from > b.from) ? 1 : ((b.from > a.from) ? -1 : 0);
		});
		options.formattedDate = moment(options.date).format('dddd, MMM DD, YYYY');
		options.formattedFrom = moment(options.from, 'HH:mm').format('h:mm A');
		options.formattedTo = moment(options.to, 'HH:mm').format('h:mm A');

		return view.render('userPages.findAvailableResults', { times: times, form: options, features });
	}

	/**
	 * Query rooms from search criteria and render the results page.
	 *
	 * @param {Object} Context The context object.
	 */
	async findSpecific ({ request, view }) {
		// importing forms from search form
		const form = request.all();
		let rooms = (await this.filterRooms(form)).rooms;

		// Sets average rating for each room
		for (var i = 0; i < rooms.length; i++) {
			// Adds new attribute - rating - to every room object
			rooms[i].rating = await this.getAverageRating(rooms[i].id);
		}

		const date = form.date;
		const from = form.from;
		const to = form.to;
		const code = random(4);
		const checkRoomAvailability = async () => {
			let results = [];
			await asyncForEach(rooms, async (item) => {
				if (await Outlook.getRoomAvailability({ date, from, to, floor: item.floor_id, calendar: item.calendar })) {
					const floorObj = (await item.floor().fetch()) === null ? { name_english: 0, name_french: 0 } : (await item.floor().fetch()).toJSON();
					const towerObj = (await item.tower().fetch()).toJSON();

					item = item.toJSON();
					item.numFeatures = item.features.length;
					item.floor = floorObj;
					item.tower = towerObj;

					Event.fire('send.room', {
						card: view.render('components.card', { form, room: item, token: request.csrfToken, from: from, to: to }),
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

	async filterRooms (options) {
		const location = options.location;
		const seats = options.seats;
		const capacity = options.capacity;
		// check boxes input

		let checkBox = Object.keys(options)
			.filter(key => key.substring(0, 4) === 'feat')
			.map(key => {
				return { checkName: key.substring(4), checkValue: options[key] };
			});

		const features = [];
		const findFeatId = async () => {
			return asyncMap(checkBox, async (feat) => {
				const result = await RoomFeature
					.findBy('name_english', feat.checkName);
				feat.checkName = result.id;
				features.push(result);

				return feat;
			});
		};
		checkBox = await findFeatId();

		// only loook for roosm that are open
		let searchResults = Room
			.query()
			.where('state_id', 1)
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

		// Features filter
		const filter = checkBox
			.filter(x => x.checkValue === '1')
			.map(x => x.checkName);

		// fetch the query
		let rooms = (await searchResults
			.with('features', (builder) => {
				builder.orderBy('id', 'asc');
			})
			.fetch()).rows;

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
			});
		};

		await forEveryFeature();

		return { rooms, features };
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
