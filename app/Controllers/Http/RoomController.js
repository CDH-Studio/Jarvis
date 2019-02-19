'use strict';
const Room = use('App/Models/Room');
const Token = use('App/Models/Token');
const Helpers = use('Helpers');
const graph = require('@microsoft/microsoft-graph-client');

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
			room.location = body.location;
			room.telephone = body.telephoneNumber;
			room.seats = body.tableSeats;
			room.capacity = body.maximumCapacity;
			room.projector = body.projectorCheck;
			room.whiteboard = body.whiteboardCheck;
			room.flipchart = body.flipChartCheck;
			room.audioConference = body.audioCheck;
			room.videoConference = body.videoCheck;

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
			room.floorplan = `uploads/floorPlans/${room.name}.png`;
			room.picture = `uploads/roomPictures/${room.name}.png`;
			room.extraEquipment = body.extraEquipment;
			room.comment = body.comment;

			await room.save();

			session.flash({ notification: 'Room Added!' });
			return response.redirect('showDetails', { id: room.id });
			// return view.render('adminDash.roomDetails', { params, room });
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
	async update ({ request, session, params, view }) {
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

		// Updates room information in database
		await Room
			.query()
			.where('name', room.name)
			.update({
				name: body.name,
				location: body.location,
				telephone: body.seats,
				seats: body.tableSeats,
				capacity: body.maximumCapacity,
				projector: body.projectorCheck,
				whiteboard: body.whiteboardCheck,
				flipchart: body.flipchart,
				audioConference: body.audioCheck,
				videoConference: body.videoCheck,
				floorplan: `uploads/floorPlans/${body.name}.png`,
				picture: `uploads/roomPictures/${body.name}.png`,
				extraEquipment: body.extraEquipment,
				comment: body.comment
			});

		room = await Room.findBy('name', body.name);

		session.flash({ notification: 'Room Updated!' });

		return view.render('adminDash.roomDetails', { params, room });
	}

	/**
	 * Render a specific room details page depending on the room Id.
	 *
	 * @param {Object} Context The context object.
	 */
	async show ({ response, auth, params, view }) {
		// Retrieves room object
		try {
			const room = await Room.findOrFail(params.id);

			var canEdit = 0;
			var layoutType = 'll';
			// if user is admin
			if (auth.user.role === 1) {
				layoutType = 'layouts/adminLayout';
				canEdit = 1;
				// check if user is viewing their own profile
			} else if (auth.user.role === 2) {
				layoutType = 'layouts/mainLayout';
				canEdit = 0;
				// check if user is viewing someone elses profile
			} else {
				return response.redirect('/');
			}
			return view.render('adminDash.roomDetails', { room, layoutType, canEdit });
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
		let page = '';

		// Sort the results by name
		rooms.sort((a, b) => {
			return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
		});

		// if user is admin
		if (auth.user.role === 1) {
			page = 'adminDash.viewRooms';
			return view.render('adminDash.viewRooms', { rooms });
		} else {
			page = 'userPages.results';
			return view.render(page, { rooms });
		}
	}

	/**
	 * Navigate to the details page of specified room.
	 *
	 * @param {Object} Context The context object.
	 */
	async goToDetails ({ request, view }) {
		const room = request.only(['title', 'floor', 'seats', 'maxCapacity', 'phoneNumber']);
		console.log(room);

		return view.render('userPages.roomDetails', { room });
	}

	/**
	 * Create the requested event on the room calendar.
	 *
	 * @param {Object} Context The context object.
	 */
	async confirmBooking ({ request, response }) {
		const { meeting, date, from, to, room } = request.only(['meeting', 'date', 'from', 'to', 'room']);
		const results = await Room
			.findBy('name', room);
		const row = results.toJSON();
		const calendar = row.calendar;

		// Information of the event
		const eventInfo = {
			'subject': meeting,
			'body': {
				'contentType': 'HTML',
				'content': 'Does late morning work for you?'
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
				'displayName': room
			},
			'attendees': []
		};

		// Create the event
		const createdEvent = this.createEvent(eventInfo, calendar);

		if (createdEvent) {
			return response.redirect('/booking');
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
					.api('/me/calendars')
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
				const calendars = await client
					.api(`/me/calendars/${calendarId}`)
					// .orderby('createdDateTime DESC')
					.get();

				return calendars;
			} catch (err) {
				console.log(err);
			}
		}
	}

	/**
	 * Create an event on the specified room calendar.
	 *
	 * @param {*} eventInfo Information of the event.
	 * @param {*} calendarId The id of the room calendar.
	 */
	async createEvent (eventInfo, calendarId) {
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

				return newEvent;
			} catch (err) {
				console.log(err);
			}
		}
	}
}

module.exports = RoomController;
