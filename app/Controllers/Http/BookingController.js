'use strict';
const Room = use('App/Models/Room');
const User = use('App/Models/User');
const Booking = use('App/Models/Booking');
const Token = use('App/Models/Token');
const graph = require('@microsoft/microsoft-graph-client');

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
		const calendar = row.calendar;
		const name = row.name;

		console.log(await this.getRoomAvailability(date, from, to, calendar));

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

		return response.route('/userDash');
	}

	/**
	 * Retrives all of the bookings that correspond to a specific room.
	 *
	 * @param {Object} Context The context object.
	 */
	async getBookings ({ params, view, auth }) {
		const userRole = await auth.user.getUserRole();
		var canEdit = (auth.user.id === Number(params.id) || userRole === 'admin') ? 1 : 0;
		var idType = (params.bookingType === 'user') ? 'user_id' : 'room_id';
		var bookingsType = (idType === 'user_id') ? 'userBookings' : 'roomBookings';

		// Queries the database fr the bookings associated to a specific room
		let searchResults = await Booking
			.query()
			.where(idType, params.id)
			.whereRaw("bookings.'to' >= ?", moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.orderBy('to', 'asc')
			.fetch();

		searchResults = searchResults.toJSON();
		const bookings = await populateBookings(searchResults);

		// counts the number of approved bookings
		let numberOfApprovedBookings = await Booking
			.query()
			.where(idType, params.id)
			.where('status', 'Approved')
			.whereRaw("bookings.'to' >= ?", moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.getCount();

		if (numberOfApprovedBookings === 0) {
			numberOfApprovedBookings = '0';
		}

		// calculate the number of bookings a room has this month
		let numberOfBookingsThisMonth = await Booking
			.query()
			.where(idType, params.id)
			.where('status', 'Approved')
			.whereRaw("bookings.'to' >= ?", moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.whereRaw("strftime('%Y-%m', bookings.'to') < ?", moment().add(1, 'M').format('YYYY-MM')) // eslint-disable-line
			.getCount();

		if (numberOfBookingsThisMonth === 0) {
			numberOfBookingsThisMonth = '0';
		}

		// Queries the database fr the cancelled bookings
		let numberOfCancelled = await Booking
			.query()
			.where(idType, params.id)
			.where('status', 'Cancelled')
			.whereRaw("bookings.'to' >= ?", moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.getCount();

		if (numberOfCancelled === 0) {
			numberOfCancelled = '0';
		}

		return view.render('userPages.manageBookings', { bookings, numberOfApprovedBookings, numberOfBookingsThisMonth, numberOfCancelled, bookingsType, canEdit });
	}

	/**
	 * Create a list of all bookings under the current user and render a view for it.
	 *
	 * @param {Object} Context The context object.
	 */
	async cancelBooking ({ params, response, view }) {
		const booking = await Booking.findBy('id', params.id);
		const roomId = booking.toJSON().room_id;
		const calendarId = (await Room.findBy('id', roomId)).toJSON().calendar;
		const eventId = booking.toJSON().event_id;
		const idType = (params.bookingType === 'user') ? booking.toJSON().user_id : booking.toJSON().room_id;

		await this.deleteEvent(calendarId, eventId);
		booking.status = 'Cancelled';
		await booking.save();

		return response.route('viewBookings', { id: idType, bookingType: params.bookingType });
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
