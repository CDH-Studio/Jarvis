'use strict';
const Room = use('App/Models/Room');
const Booking = use('App/Models/Booking');
const Token = use('App/Models/Token');
const Helpers = use('Helpers');
const graph = require('@microsoft/microsoft-graph-client');
const Drive = use('Drive');

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
		return view.render('adminDash.addRoomForm');
	}

	/**
	 * Adds a room Object into the Database.
	 *
	 * @param {Object} Context The context object.
	 */
	async addRoom ({ request, response, session, auth }) {
		try {
			// Retrieves user input
			const body = request.all();

			// Populates the room object's values
			const room = new Room();
			room.name = body.name;
			room.fullName = body.fullName;
			room.floor = body.floor;
			room.tower = body.tower === '0' ? 'West' : 'East';
			room.telephone = body.telephoneNumber;
			room.seats = body.tableSeats;
			room.capacity = body.maximumCapacity;
			room.projector = body.projectorCheck;
			room.whiteboard = body.whiteboardCheck;
			room.flipchart = body.flipChartCheck;
			room.audioConference = body.audioCheck;
			room.videoConference = body.videoCheck;
			room.surfaceHub = body.surfaceHubCheck;
			room.pc = body.pcCheck;

			// Upload process - Floor Plan
			const floorPlanImage = request.file('floorPlan', {
				types: ['image'],
				size: '2mb'
			});
			await floorPlanImage.move(Helpers.publicPath('uploads/floorPlans/'), {
				name: `${room.name}_floorPlan.png`
			});
			console.log(Helpers.publicPath);

			// Upload process - Room Picture
			const roomImage = request.file('roomPicture', {
				types: ['image'],
				size: '2mb'
			});
			await roomImage.move(Helpers.publicPath('uploads/roomPictures/'), {
				name: `${room.name}_roomPicture.png`
			});

			// Populates the room object's values
			room.floorplan = `uploads/floorPlans/${room.name}.png`;
			room.picture = `uploads/roomPictures/${room.name}.png`;
			room.extraEquipment = body.extraEquipment;
			room.comment = body.comment;
			room.state = body.state === undefined ? 2 : 1;

			await room.save();
			session.flash({ notification: 'Room Added!' });

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

		return view.render('adminDash.editRoom', { room: room });
	}

	/**
	 * Updates a room object in the database.
	 *
	 * @param {Object} Context The context object.
	 */
	async update ({ request, session, params, response, view }) {
		// Retrieves room object
		let room = await Room.findBy('id', params.id);

		// Retrieves user input
		const body = request.all();

		await Drive.delete('uploads/floorPlans/' + `${room.name}_floorPlan.png`);
		await Drive.delete('uploads/roomPictures/' + `${room.name}_roomPicture.png`);

		// Upload process - Floor Plan
		const floorPlanImage = request.file('floorPlan', {
			types: ['image'],
			size: '2mb'
		});
		await floorPlanImage.move(Helpers.publicPath('uploads/floorPlans/'), {
			name: `${body.name}_floorPlan.png`
		});

		// Upload process - Room Picture
		const roomImage = request.file('roomPicture', {
			types: ['image'],
			size: '2mb'
		});
		await roomImage.move(Helpers.publicPath('uploads/roomPictures/'), {
			name: `${body.name}_roomPicture.png`
		});

		body.state = body.state === undefined ? 2 : 1;

		// Updates room information in database
		await Room
			.query()
			.where('name', room.name)
			.update({
				name: body.name,
				fullName: body.fullName,
				floor: body.floor,
				tower: body.tower,
				telephone: body.seats,
				seats: body.tableSeats,
				capacity: body.maximumCapacity,
				projector: body.projectorCheck,
				whiteboard: body.whiteboardCheck,
				flipchart: body.flipchart,
				audioConference: body.audioCheck,
				videoConference: body.videoCheck,
				surfaceHub: body.surfaceHubCheck,
				pc: body.pcCheck,
				floorplan: `uploads/floorPlans/${body.name}.png`,
				picture: `uploads/roomPictures/${body.name}.png`,
				extraEquipment: body.extraEquipment,
				comment: body.comment,
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
		// Retrieves room object
		try {
			// get the search form data if employee view
			const form = request.only(['date', 'from', 'to']);
			const room = await Room.findOrFail(params.id);
			var isAdmin = 0;
			var layoutType = 'll';
			// if user is admin
			if (auth.user.role === 1) {
				layoutType = 'layouts/adminLayout';
				isAdmin = 1;
				// check if user is viewing their own profile
			} else if (auth.user.role === 2) {
				layoutType = 'layouts/mainLayout';
				isAdmin = 0;
				// check if user is viewing someone elses profile
			} else {
				return response.redirect('/');
			}
			return view.render('userPages.roomDetails', { room, layoutType, isAdmin, form });
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

		// if user is admin
		if (auth.user.role === 1) {
			return view.render('adminDash.viewRooms', { rooms, stats });
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
		// basic search for mandatory input like (To,From and Date)
		let searchResults = Room
			.query()
			.clone();

		// if the location is selected then query, else dont
		if (location !== 'undefined') {
			searchResults = searchResults
				.where('floor', location)
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

		// iterate through the rooms
		async function asyncForEach (arr, callback) {
			for (let i = 0; i < arr.length; i++) {
				await callback(arr[i], i, arr);
			}
		}

		const checkRoomAvailability = async () => {
			await asyncForEach(rooms, async (item, index, items) => {
				const startTime = date + 'T' + from;
				const endTime = date + 'T' + to;

				// if there is a calendar for the room
				if (item.calendar !== 'insertCalendarHere' && item.calendar !== null) {
					// query the events within the search time range
					const calendarViews = (await this.getCalendarView(
						item.calendar,
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

					// remove the room if it is not available
					const available = calendarViews.length === 0;

					if (!available) {
						items.splice(index, 1);
					}
				}
			});
		};

		await checkRoomAvailability();

		// Sort the results by name
		rooms.sort((a, b) => {
			return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
		});

		return view.render('userPages.results', { rooms, form });
	}

	/**
	 * Navigate to the details page of specified room.
	 *
	 * @param {Object} Context The context object.
	 */
	// async goToDetails ({ request, view }) {
	// //  get all information from card view
	// const results = request.all();
	// // take the unique id from the rooom and search tyhe database for the rest of the information to display in room details
	// let roomId = results.id;
	// let searchResults = await Room
	// .findBy('id', roomId);
	// const room = searchResults.toJSON();
	// return view.render('userPages.roomDetails', { room });
	// }

	/**
	 * Create the requested event on the room calendar.
	 *
	 * @param {Object} Context The context object.
	 */
	async confirmBooking ({ request, response, session, auth }) {
		const { meeting, date, from, to, room } = request.only(['meeting', 'date', 'from', 'to', 'room']);
		const results = await Room
			.findBy('id', room);
		const row = results.toJSON();
		const calendar = row.calendar;
		const name = row.name;

		// Information of the event
		const eventInfo = {
			'subject': meeting,
			'body': {
				'contentType': 'HTML',
				'content': 'Jarvis Daily Standup'
			},
			'start': {
				'dateTime': `${date}T${from}`,
				'timeZone': 'Eastern Standard Time'
			},
			'end': {
				'dateTime': `${date}T${to}`,
				'timeZone': 'Eastern Standard Time'
			},
			'location': {
				'displayName': name
			},
			'attendees': [
				{
					'emailAddress': {
						'address': '',
						'name': 'Yunwei Li'
					},
					'type': 'required'
				}
			]
		};

		// Create the event
		const booking = new Booking();
		booking.subject = meeting;
		booking.status = 'Pending';
		await auth.user.bookings().save(booking);
		await results.bookings().save(booking);

		this.createEvent(eventInfo, calendar, booking, auth.user, results);

		session.flash({
			notification: `Room ${name} has been booked. Please click here to view your bookings.`,
			url: '/viewBookings'
		});

		return response.redirect('/booking');
	}

	/**
	 * Create a list of all bookings under the current user and render a view for it.
	 *
	 * @param {Object} Context The context object.
	 */
	async viewBookings ({ auth, view }) {
		const results = (await auth.user.bookings().fetch()).toJSON();

		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		async function asyncMap (arr, callback) {
			let arr2 = [];

			for (let i = 0; i < arr.length; i++) {
				arr2.push(await callback(arr[i], i, arr));
			}

			return arr2;
		}

		let bookings = [];
		const populateBookings = async () => {
			bookings = await asyncMap(results, async (result) => {
				const booking = {};

				const from = new Date(result.from);
				const to = new Date(result.to);
				booking.subject = result.subject;
				booking.status = result.status;
				booking.date = days[from.getDay()] + ', ' + months[from.getMonth()] + ' ' + from.getDate() + ', ' + from.getFullYear();
				booking.time = from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + to.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
				booking.room = (await Room.findBy('id', result.room_id)).toJSON().name;
				booking.roomId = result.room_id;
				booking.id = result.id;

				return booking;
			});
		};

		await populateBookings();

		return view.render('userPages.manageBookings', { bookings: bookings });
	}

	/**
	 * Create a list of all bookings under the current user and render a view for it.
	 *
	 * @param {Object} Context The context object.
	 */
	async cancelBooking ({ params, response }) {
		const booking = await Booking.findBy('id', params.id);
		const roomId = booking.toJSON().room_id;
		const calendarId = (await Room.findBy('id', roomId)).toJSON().calendar;
		const eventId = booking.toJSON().event_id;

		await this.deleteEvent(calendarId, eventId);
		booking.status = 'Cancelled';
		await booking.save();

		return response.redirect('/viewBookings');
	}

	/**
	 * Create an event on the specified room calendar.
	 *
	 * @param {String} eventInfo Information of the event.
	 * @param {String} calendarId The id of the room calendar.
	 * @param {Object} booking The Booking (Lucid) Model.
	 * @param {Object} user The User (Lucid) Model.
	 * @param {Object} room The Room (Lucid) Model.
	 */
	async createEvent (eventInfo, calendarId, booking, user, room) {
		const accessToken = await getAccessToken();

		if (accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const newEvent = await client
					.api(`/me/calendars/${calendarId}/events`)
					.post(eventInfo);

				if (newEvent) {
					booking.from = newEvent.start.dateTime;
					booking.to = newEvent.end.dateTime;
					booking.event_id = newEvent.id;
					booking.status = 'Approved';
					await user.bookings().save(booking);
					await room.bookings().save(booking);

					return newEvent;
				}
			} catch (err) {
				console.log(err);
				booking.status = 'Failed';
				await user.bookings().save(booking);
				await room.bookings().save(booking);
			}
		}
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
	 * Delete an event from the room calendar.
	 *
	 * @param {String} calendarId The id of the room calendar.
	 * @param {String} eventId The id of the event to delete.
	 */
	async deleteEvent (calendarId, eventId) {
		const accessToken = await getAccessToken();

		if (accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				await client
					.api(`/me/calendars/${calendarId}/events/${eventId}`)
					.delete();
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
}

module.exports = RoomController;
