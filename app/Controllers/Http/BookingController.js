'use strict';
const Room = use('App/Models/Room');
const User = use('App/Models/User');
const Booking = use('App/Models/Booking');
const Env = use('Env');
const Logger = use('Logger');
const Outlook = new (use('App/Outlook'))();
// Used for time related calcuklations and formatting
const moment = require('moment');
require('moment-round');

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
		const calendar = row.calendar;
		console.log(calendar);

		if (!await Outlook.getRoomAvailability({ date, from, to, floor: row.floor_id, calendar })) {
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
				'content': ''
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

		Outlook.createEvent({ eventInfo, booking, user: auth.user, room: results, calendarId: calendar });

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
	async getBookings ({ params, view, auth, response }) {
		const userRole = await auth.user.getUserRole();
		var canEdit = (auth.user.id === Number(params.id) || userRole === 'admin') ? 1 : 0;
		var idType = (params.bookingType === 'user') ? 'user_id' : 'room_id';
		var bookingsType = (idType === 'user_id') ? 'userBookings' : 'roomBookings';

		if (userRole !== 'admin' && idType === "user_id" && parseInt(params.id) !== auth.user.id ) {
			response.route('home');
		}

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
		const room = (await Room.findBy('id', roomId)).toJSON();
		const floor = room.floor_id;
		const eventId = booking.toJSON().event_id;
		const idType = (params.bookingType === 'user') ? booking.toJSON().user_id : booking.toJSON().room_id;

		let calendarId;
		if (Env.get('DEV_OUTLOOK', 'prod') !== 'prod') {
			calendarId = (await Room.findBy('id', roomId)).toJSON().calendar;
		}
		await Outlook.deleteEvent({ eventId, floor, calendarId });
		booking.status = 'Cancelled';
		await booking.save();

		return response.route('viewBookings', { id: idType, bookingType: params.bookingType });
	}

	/**
	* Sync events with Outlook
	*
	* @param {String} userId The id of the current user.
	*/
	async syncEvents (userId) {
		try {
			console.log('sync');
			const bookings = await Booking
				.query()
				.where('user_id', userId)
				.where('status', 'Approved')
				.fetch();

			console.log(bookings.toJSON());

			for (const booking in bookings) {
				console.log(booking);
				booking.status = Outlook.sync({ eventId: booking.event_id, floor: 0 });
				booking.save();
			}
		} catch (err) {
			Logger.debug(err);
		}
	}
}

module.exports = BookingController;
