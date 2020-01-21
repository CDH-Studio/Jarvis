'use strict';

const Model = use('Model');
const Outlook = new (use('App/Outlook'))();
const Event = use('Event');

class Room extends Model {
	bookings () {
		return this.hasMany('App/Models/Booking');
	}

	reviews () {
		return this.hasMany('App/Models/Review');
	}

	reports () {
		return this.hasMany('App/Models/Report');
	}

	building () {
		return this.belongsTo('App/Models/Building', 'building_id');
	}

	floor () {
		return this.belongsTo('App/Models/Floor', 'floor_id');
	}

	tower () {
		return this.belongsTo('App/Models/Tower', 'tower_id');
	}

	room () {
		return this.belongsTo('App/Models/Room', 'room_id');
	}

	features () {
		return this
			.belongsToMany('App/Models/RoomFeature')
			.pivotTable('room_features_pivot');
	}

	static get table () {
		return 'rooms';
	}

	// Getter to retreive the room name by it's id
	static async getName (room_id) {
		var room = await this.findOrFail(room_id);
		return room.name;
	}

	/*
	* loop through every given tile slot and search for avaialable rooms
	*
	* return 0 if not available
	*/
	static async FlexibleSearchRoomsByTime ({ rooms, timeSlots, options, csrfToken, code, antl, userId }) {
		try {
			// delay to allow page to laod before pushing results
			setTimeout(function () {
				// Asynchronous check with agent if room is available and push room card to results page
				let promises = [];
				timeSlots.forEach(async timeSlot => {
					let searchOptions = [];
					searchOptions.date = options.flexibleSearchDate;
					searchOptions.from = timeSlot.start;
					searchOptions.to = timeSlot.end;
					searchOptions.duration = Number(options.flexibleSearchDuration) * 60;

					// Asynchronous check with agent if room is available and push room card to results page
					rooms.forEach(async room => {
						promises.push(
							Room.pushAvailableRoomCard({ room: room, options: searchOptions, csrfToken: csrfToken, code: code, antl: antl, userId })
						);
					});
				});

				Promise.all(promises).then(values => {
					Event.fire('send.done', {
						message: 'done',
						code: code,
						userId
					});
				});

				return 1;
			}, 1000);
		} catch (e) {
			console.log(e);
			return 0;
		}
	}

	/*
	* loop through each room and check if it is available
	*
	* return 0 if not available
	*/
	static async FixedSearchRoomsBy ({ rooms, options, csrfToken, code, antl, userId }) {
		try {
			// delay to allow page to laod before pushing results
			setTimeout(function () {
				// Asynchronous check with agent if room is available and push room card to results page
				let searchOptions = [];
				searchOptions.date = options.fixedSearchDate;
				searchOptions.from = options.fixedSearchFrom;
				searchOptions.to = options.fixedSearchTo;
				searchOptions.duration = options.duration;

				let promises = [];
				// Asynchronous check with agent if room is available and push room card to results page
				rooms.forEach(async room => {
					promises.push(
						Room.pushAvailableRoomCard({ room: room, options: searchOptions, csrfToken: csrfToken, code: code, antl: antl, userId })
					);
				});

				// once all searchs are done then send done signal to resutls page
				Promise.all(promises).then(values => {
					Event.fire('send.done', {
						message: 'done',
						code: code,
						userId
					});
				});

				return 1;
			}, 1000);
		} catch (e) {
			console.log(e);
			return 0;
		}
	}

	/*
	* Push the room card to PUSHER to send to the view if room is available
	*
	* return 0 if not available
	*/
	static async pushAvailableRoomCard ({ room, options, csrfToken, code, antl, userId }) {
		try {
			// check room availability
			let roomAvailability = await Outlook.getRoomAvailability({
				date: options.date,
				from: options.from,
				to: options.to,
				duration: options.duration,
				floor: room.floor_id,
				calendar: room.calendar
			});

			if (roomAvailability) {
				const View = use('View');
				room.numFeatures = room.features.length;

				// render room card
				let card = View.render('components.card', { antl: antl, form: options, room: room, features: room.features, token: csrfToken, from: options.from, to: options.to });

				// push card
				Event.fire('send.room', {
					card: card,
					floor: room.floor,
					startTimeID: options.from.slice(0, 2) + options.from.slice(3, 5),
					code: code,
					userId
				});
			}
			return roomAvailability;
		} catch (e) {
			console.log(e);
			return 0;
		}
	}

	static async filterRooms (floor, seats, capacity, features) {
		// only loook for rooms that are open (status == 1)
		let roomQuery = Room
			.query()
			.where('state_id', 1)
			.clone();

		// if the location is selected then query, else dont
		if (floor !== 'undefined') {
			const floorID = parseInt(floor);
			roomQuery = roomQuery
				.where('floor_id', floorID)
				.clone();
		}

		// if the "number of seats" is selected then add to query, else ignore it
		if (seats) {
			roomQuery = roomQuery
				.where('seats', '>=', seats)
				.clone();
		}

		// if the "number of people" is selected then add to query, else ignore it
		if (capacity) {
			roomQuery = roomQuery
				.where('capacity', '>=', capacity)
				.clone();
		}

		if (features) {
			for (let i = 0; i < features.length; i++) {
				roomQuery = roomQuery
					.whereHas('features', (builder) => {
						builder.where('room_feature_id', parseInt(features[i]));
					}).clone();
			}
		}

		let rooms = (await roomQuery
			.with('features', (builder) => {
				builder.orderBy('name_english', 'asc');
			})
			.with('floor')
			.with('tower')
			.fetch());

		return rooms;
	}
}

module.exports = Room;
