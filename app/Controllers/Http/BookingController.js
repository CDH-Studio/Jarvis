'use strict';
const Floor = use('App/Models/Floor');
const Room = use('App/Models/Room');
const Booking = use('App/Models/Booking');
const Env = use('Env');
const Logger = use('Logger');
const Outlook = new (use('App/Outlook'))();
// Used for time related calcuklations and formatting
const moment = require('moment');
require('moment-round');

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
			url: `/user/${auth.user.id}/bookings/upcoming/month`
		});

		return response.route('/userDash');
	}

	/**
	 * Retrives all of the bookings that correspond to a specific room or user.
	 *
	 * @param {Object} Context The context object.
	 */
	async viewBookings ({ request, params, view, auth, response }) {
		const User = use('App/Models/User');
		const Building = use('App/Models/Building');

		// get user role for booking editing
		const userRole = await auth.user.getUserRole();
		var canEdit = (auth.user.id === Number(params.id) || userRole === 'admin') ? 1 : 0;
		// get room or user filtering
		var idType = (params.bookingType === 'user') ? 'user_id' : 'room_id';

		// reroute home if user does not have permission
		if (userRole !== 'admin' && idType === 'user_id' && parseInt(params.id) !== auth.user.id) {
			response.route('home');
		}

		let startTimeFilter, endTimeFilter, searchResults, bookings;

		let viewFilters = {};

		// find upcoming meeting and all upcoming meetings (approved and cancellled)
		if (params.catFilter === 'upcoming' || params.catFilter === 'all') {
			startTimeFilter = moment().format('YYYY-MM-DDTHH:mm');

			// determine time filter for upcoming approved and all meetings
			switch (String(params.limitFilter)) {
				case 'month':
					endTimeFilter = moment().endOf('month').format('YYYY-MM-DD hh:mm');
					break;
				case '3-months':
					endTimeFilter = moment().add(3, 'months').endOf('month').format('YYYY-MM-DD hh:mm');
					break;
				case '6-months':
					endTimeFilter = moment().add(6, 'months').endOf('month').format('YYYY-MM-DD hh:mm');
					break;
				case 'year':
					endTimeFilter = moment().add(1, 'years').format('YYYY-MM-DD hh:mm');
					break;
				case 'all':
					endTimeFilter = moment().add(100, 'years').endOf('month').format('YYYY-MM-DD hh:mm');
					break;
				default:
					return response.route('home');
			}

			if (params.catFilter === 'upcoming') {
				// query for upcoming approved meetings
				searchResults = await Booking
					.query()
					.where(idType, params.id)
					.where('status', 'Approved')
					.whereBetween('from', [startTimeFilter, endTimeFilter])
					.orderBy('from', 'asc')
					.with('room')
					.with('user')
					.fetch();
			} else {
				// query for upcoming meetings (approved and cancelled)
				searchResults = await Booking
					.query()
					.where(idType, params.id)
					.whereBetween('from', [startTimeFilter, endTimeFilter])
					.orderBy('from', 'asc')
					.with('room')
					.with('user')
					.fetch();
			}

		// determine time filter for cancelled and past meetings (approved)
		} else if (params.catFilter === 'cancelled' || params.catFilter === 'past') {
			endTimeFilter = moment().format('YYYY-MM-DDTHH:mm');

			// determine time filter for upcoming approved and all meetings
			switch (params.limitFilter) {
				case 'month':
					startTimeFilter = moment().startOf('month').format('YYYY-MM-DD hh:mm');
					break;
				case '3-months':
					startTimeFilter = moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD hh:mm');
					break;
				case '6-months':
					startTimeFilter = moment().subtract(6, 'months').startOf('month').format('YYYY-MM-DD hh:mm');
					break;
				case 'year':
					startTimeFilter = moment().subtract(1, 'years').format('YYYY-MM-DD hh:mm');
					break;
				case 'all':
					startTimeFilter = moment().subtract(100, 'years').format('YYYY-MM-DD hh:mm');
					break;
				default:
					return response.route('home');
			}

			if (params.catFilter === 'cancelled') {
				// query for cancelled meetings based on cancellation date
				searchResults = await Booking
					.query()
					.where(idType, params.id)
					.where('status', 'Cancelled')
					.whereBetween('updated_at', [startTimeFilter, endTimeFilter])
					.orderBy('updated_at', 'asc')
					.with('room')
					.with('user')
					.fetch();
			} else {
				// query for past approved meetings based on "from" date
				searchResults = await Booking
					.query()
					.where(idType, params.id)
					.where('status', 'Approved')
					.whereBetween('from', [startTimeFilter, endTimeFilter])
					.orderBy('updated_at', 'asc')
					.with('room')
					.with('user')
					.fetch();
			}
		} else {
			return response.route('home');
		}

		viewFilters.bookingType = params.bookingType;
		viewFilters.id = params.id;
		viewFilters.catFilter = params.catFilter;
		viewFilters.limitFilter = params.limitFilter;

		// bookings = await populateBookings(searchResults.toJSON());
		bookings = searchResults.toJSON();

		var selectedBuilding;
		var allBuildings;

		searchResults = await User.query().where('id', auth.user.id).with('role').firstOrFail();
		const user = searchResults.toJSON();

		if (user.role.name === 'admin') {
			selectedBuilding = request.cookie('selectedBuilding');
			// get all builig info admin nav bar since this route is shared with regular users and admin
			// therefore, the admin middle-ware can't retrieve building info to pass to view
			allBuildings = await Building.all();
			allBuildings = allBuildings.toJSON();
		}

		return view.render('userPages.manageBookings', {
			selectedBuilding,
			allBuildings,
			bookings,
			viewFilters,
			canEdit,
			moment
		});
	}

	/**
	 * Create a list of all bookings under the current user and render a view for it.
	 *
	 * @param {Object} Context The context object.
	 */
	async cancelBooking ({ session, params, response, view }) {
		try {
			// fetch booking
			const result = await Booking
				.query()
				.where('id', params.id)
				.with('room')
				.first();

			let booking = result.toJSON();

			// get floor of booking to use correct service account
			const floor = (await Floor.findOrFail(booking.room.floor_id)).toJSON();

			// get calendarID to use when communicating to outlook
			let calendarId;
			if (Env.get('DEV_OUTLOOK', 'prod') !== 'prod') {
				calendarId = (await Room.findBy('id', booking.room.id)).toJSON().calendar;
			}

			await Outlook.deleteEvent({
				eventId: booking.event_id,
				floorId: floor.id,
				calendarId
			});

			// Update database
			result.status = 'Cancelled';
			await result.save();

			session.flash({
				notification: 'Booking Successfully Cancelled'
			});

			// select correct id for bookings filter type (user or room)
			const idType = (params.bookingType === 'user') ? booking.user_id : booking.room_id;

			return response.route('viewBookings', {
				id: idType,
				bookingType: params.bookingType,
				catFilter: 'upcoming',
				limitFilter: 'month'
			});
		} catch (error) {
			console.log(error);
			return response.redirect('/');
		}
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
