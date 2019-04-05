'use strict';
const Room = use('App/Models/Room');
const User = use('App/Models/User');
const Booking = use('App/Models/Booking');
const Token = use('App/Models/Token');
const graph = require('@microsoft/microsoft-graph-client');
const Axios = require('axios');

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
			const userInfo = (await User.findBy('id', result.user_id)).toJSON();
			booking.userName = userInfo.firstname + ' ' + userInfo.lastname;
			booking.userId = userInfo.id;

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
		const name = row.name;

		if (!await this.getRoomAvailability(date, from, to, row.floor, row.calendar)) {
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

		this.createEvent(eventInfo, booking, auth.user, results);

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

		if (auth.user.id === Number(params.id) || userRole === 'admin') {
			canEdit = 1;
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

		// check if user is viewing their own profile
		if (auth.user.id === Number(params.id) || userRole === 'admin') {
			layoutType = 'layouts/mainLayout';
			canEdit = 1;
		}

		const results = (await Booking.query().where('user_id', params.id).fetch()).toJSON();
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
	async getRoomAvailability (date, from, to, floor, calendar) {
		console.log(date, from, to, calendar);

		const res = await Axios.post('http://142.53.209.100:8080/avail', {
			room: calendar,
			start: date + 'T' + from,
			end: date + 'T' + to,
			floor: floor
		});

		return res.data === 'free';
	}

	/**
	 * Create an event on the specified room calendar.
	 *
	 * @param {String} eventInfo Information of the event.
	 * @param {Object} booking The Booking (Lucid) Model.
	 * @param {Object} user The User (Lucid) Model.
	 * @param {Object} room The Room (Lucid) Model.
	 */
	async createEvent (eventInfo, booking, user, room) {
		try {
			console.log(room);
			await Axios.post('http://142.53.209.100:8080/booking', {
				room: room.calendar,
				start: eventInfo.start.dateTime,
				end: eventInfo.end.dateTime,
				subject: eventInfo.subject,
				body: eventInfo.body.content,
				floor: room.floor
				// attendees: ['yunwei.li@canada.ca']
			});

			booking.from = eventInfo.start.dateTime;
			booking.to = eventInfo.end.dateTime;
			booking.event_id = eventInfo.id ? eventInfo.id : '';
			booking.status = 'Approved';
			await user.bookings().save(booking);
			await room.bookings().save(booking);

			return eventInfo;
		} catch (err) {
			console.log(err);
			booking.status = 'Failed';
			await user.bookings().save(booking);
			await room.bookings().save(booking);
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
}

module.exports = BookingController;
