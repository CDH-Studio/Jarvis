'use strict';
const Room = use('App/Models/Room');
const Booking = use('App/Models/Booking');
const Token = use('App/Models/Token');
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

/**
 * Populate bookings from booking query results.
 *
 * @param {Object} results Results from bookings query.
 *
 * @returns {Object} The access token.
 *
 */
async function populateBookings (results) {
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
	const populate = async () => {
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

	await populate();

	return bookings;
}

class BookingController {
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

		if (!await this.getRoomAvailability(date, from, to, calendar)) {
			session.flash({
				error: `Room ${name} has already been booked for the time selected!`
			});

			return response.route('showRoom', { id: room });
		}

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
			url: `/user/${auth.user.id}/bookings`
		});

		return response.redirect('/booking');
	}

	/**
	 * Retrives all of the bookings that correspond to a specific room.
	 *
	 * @param {Object} Context The context object.
	 */
	async getRoomBookings ({ params, view, auth, response }) {
		var canEdit = 0;
		var layoutType;
		const userRole = await auth.user.getUserRole();

		if (userRole === 'admin') {
			layoutType = 'layouts/adminLayout';
			canEdit = 1;
			// check if user is viewing their own profile
		} else if (auth.user.id === Number(params.id) && userRole === 'user') {
			layoutType = 'layouts/mainLayout';
			canEdit = 1;

			// check if user is viewing someone elses profile
		} else if (auth.user.id !== Number(params.id) && userRole === 'user') {
			layoutType = 'layouts/mainLayout';
			canEdit = 0;
		} else {
			return response.redirect('/');
		}

		// Queries the database fr the bookings associated to a specific room
		let searchResults = await Booking
			.query()
			.where('room_id', params.id)
			.fetch();

		searchResults = searchResults.toJSON();
		const bookings = await populateBookings(searchResults);

		return view.render('userPages.manageBookings', { bookings, layoutType, canEdit });
	}

	/**
	 * Create a list of all bookings under the current user and render a view for it.
	 *
	 * @param {Object} Context The context object.
	 */
	async getUserBookings ({ params, auth, view, response }) {
		var canEdit = 0;
		var layoutType = '';
		const userRole = await auth.user.getUserRole();

		if (userRole === 'admin') {
			layoutType = 'layouts/adminLayout';
			canEdit = 1;
		// check if user is viewing their own profile
		} else if (auth.user.id === Number(params.id) && userRole === 'user') {
			layoutType = 'layouts/mainLayout';
			canEdit = 1;
		} else {
			return response.redirect('/');
		}

		const results = (await auth.user.bookings().fetch()).toJSON();
		const bookings = await populateBookings(results);

		return view.render('userPages.manageUserBookings', { bookings, layoutType, canEdit });
	}

	/**
	 * Create a list of all bookings under the current user and render a view for it.
	 *
	 * @param {Object} Context The context object.
	 */
	async cancelBooking ({ params, response, auth }) {
		const booking = await Booking.findBy('id', params.id);
		const roomId = booking.toJSON().room_id;
		const calendarId = (await Room.findBy('id', roomId)).toJSON().calendar;
		const eventId = booking.toJSON().event_id;

		await this.deleteEvent(calendarId, eventId);
		booking.status = 'Cancelled';
		await booking.save();

		return response.redirect(`/user/${auth.user.id}/bookings`);
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
}

module.exports = BookingController;
