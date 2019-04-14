'use strict';
const Room = use('App/Models/Room');
const User = use('App/Models/User');
const Booking = use('App/Models/Booking');
const Token = use('App/Models/Token');
const Env = use('Env');
const graph = require('@microsoft/microsoft-graph-client');
const axios = require('axios');

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

		return response.redirect('/userDash');
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
			.whereRaw("bookings.'from' >= ?", moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.orderBy('from', 'asc')
			.fetch();

		searchResults = searchResults.toJSON();
		const bookings = await populateBookings(searchResults);

		// counts the number of approved bookings
		let numberOfApprovedBookings = await Booking
			.query()
			.where('room_id', params.id)
			.where('status', 'Approved')
			.whereRaw("bookings.'from' >= ?", moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.getCount();

		// calculate the number of bookings a room has this month
		let numberOfBookingsThisMonth = await Booking
			.query()
			.where('room_id', params.id)
			.where('status', 'Approved')
			.whereRaw("bookings.'from' >= ?", moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.whereRaw("strftime('%Y-%m', bookings.'from') < ?", moment().add(1, 'M').format('YYYY-MM')) // eslint-disable-line
			.fetch();

		numberOfBookingsThisMonth = numberOfBookingsThisMonth.toJSON();

		// Calculates the number of hours in bookings for this month
		let numberOfHours = 0;
		for (var i = 0; i < numberOfBookingsThisMonth.length; i++) {
			let fromTime = moment(numberOfBookingsThisMonth[0].from);
			let toTime = moment(numberOfBookingsThisMonth[0].to);
			let duration = moment.duration(toTime.diff(fromTime));
			numberOfHours += duration.asHours();
		}

		numberOfBookingsThisMonth = numberOfBookingsThisMonth.length;

		return view.render('userPages.manageBookings', { bookings, numberOfApprovedBookings, numberOfBookingsThisMonth, numberOfHours, layoutType, canEdit });
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

		// retrieves the bookings
		let results = await Booking
			.query()
			.where('user_id', params.id)
			.whereRaw("bookings.'from' >= ?", moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.orderBy('from', 'asc')
			.fetch();

		results = results.toJSON();
		const bookings = await populateBookings(results);

		// counts the number of approved bookings
		let numberOfApprovedBookings = await Booking
			.query()
			.where('user_id', params.id)
			.where('status', 'Approved')
			.whereRaw("bookings.'from' >= ?", moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.getCount();

		// calculate the number of bookings a room has this month
		let numberOfBookingsThisMonth = await Booking
			.query()
			.where('user_id', params.id)
			.where('status', 'Approved')
			.whereRaw("bookings.'from' >= ?", moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.whereRaw("strftime('%Y-%m', bookings.'from') < ?", moment().add(1, 'M').format('YYYY-MM')) // eslint-disable-line
			.fetch();

		numberOfBookingsThisMonth = numberOfBookingsThisMonth.toJSON();

		// Calculates the number of hours in bookings for this month
		let numberOfHours = 0;
		for (var i = 0; i < numberOfBookingsThisMonth.length; i++) {
			let fromTime = moment(numberOfBookingsThisMonth[0].from);
			let toTime = moment(numberOfBookingsThisMonth[0].to);
			let duration = moment.duration(toTime.diff(fromTime));
			numberOfHours += duration.asHours();
		}

		numberOfBookingsThisMonth = numberOfBookingsThisMonth.length;

		return view.render('userPages.manageUserBookings', { bookings, numberOfApprovedBookings, numberOfBookingsThisMonth, numberOfHours, layoutType, canEdit });
	}

	/**
	 * Create a list of all bookings under the current user and render a view for it.
	 *
	 * @param {Object} Context The context object.
	 */
	async cancelBooking ({ params, response, view }) {
		const booking = await Booking.findBy('id', params.id);
		const roomId = booking.toJSON().room_id;
		const room = (await Room.findBy('id', roomId)).toJSON();
		const calendarId = room.calendar;
		const floor = room.floor;
		// const userId = booking.toJSON().user_id;
		// const calendarId = (await Room.findBy('id', roomId)).toJSON().calendar;
		const eventId = booking.toJSON().event_id;

		await this.deleteEvent(calendarId, eventId, floor);
		booking.status = 'Cancelled';
		await booking.save();

		if (params.bookingType === 'user') {
			return response.route('viewBookings', { id: userId });
		} else {
			return response.route('roomBookings', { id: roomId });
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
	async getRoomAvailability (date, from, to, floor, calendar) {
		console.log(date, from, to, calendar);

		const res = await axios.post(`${Env.get('EXCHANGE_AGENT_SERVER', 'localhost:3000')}/avail`, {
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
			const res = await axios.post(`${Env.get('EXCHANGE_AGENT_SERVER', 'localhost:3000')}/booking`, {
				room: room.calendar,
				start: eventInfo.start.dateTime,
				end: eventInfo.end.dateTime,
				subject: eventInfo.subject,
				body: eventInfo.body.content,
				floor: room.floor
				// attendees: ['yunwei.li@canada.ca']
			});

			const eventId = res.data.eventId.UniqueId;
			console.log(eventId);

			booking.from = eventInfo.start.dateTime;
			booking.to = eventInfo.end.dateTime;
			booking.event_id = eventId;
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
	async deleteEvent (calendarId, eventId, floor) {
		try {
			const res = await axios.post(`${Env.get('EXCHANGE_AGENT_SERVER', 'localhost:3000')}/cancel`, {
				room: calendarId,
				eventId: eventId,
				floor: floor
			});

			console.log(res);
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = BookingController;
