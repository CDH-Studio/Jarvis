'use strict';
const Room = use('App/Models/Room');
const User = use('App/Models/User');
const Report = use('App/Models/Report');
const Booking = use('App/Models/Booking');
const Review = use('App/Models/Review');
const Event = use('Event');
const Token = use('App/Models/Token');

var moment = require('moment');
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

async function asyncForEach (arr, callback) {
	for (let i = 0; i < arr.length; i++) {
		await callback(arr[i], i, arr);
	}
}

class HomeController {
	/**
	*
	* Render landing page based on user type.
	* Admin: gets admin dashboard
	* User: gets User dashboard
	*
	* @param {response}
	* @param {auth}
	*
	*/
	async home ({ response, auth }) {
		try {
			// cheack user is logged-in and role
			await auth.check();
			const userRole = await auth.user.getUserRole();

			if (userRole === 'admin') {
				return response.route('adminDash', { auth });
			} else {
				return response.route('booking', { auth });
			}
		} catch (error) {
			return response.route('login');
		}
	}

	/**
	*
	* Render user dashboard and gather information for dashboard view
	*
	* @param {view}
	*
	*/
	async userDashboard ({ view, auth }) {
		const code = await this.getAvailableRooms({ auth, view });
		const freqRooms = await this.getFreqBooked({ auth });
		return view.render('userPages.booking', { code, freqRooms });
	}

	/**
	*
	* Render admin dashboard
	*
	* @param {view}
	*
	*/
	async adminDashboard ({ view }) {
		const numberOfUsers = await this.getNumberofUsers();
		const roomStats = await this.getRoomStats();
		const issueStats = await this.getIssueStats();
		const bookings = await this.getBookings();
		const roomStatusStats = await this.getRoomStatusStats();
		const roomIssueStats = await this.getRoomIssueStats();
		const topFiveRooms = await this.getRoomPopularity();
		const highestRatedRooms = await this.getRoomRatings();

		return view.render('adminDash', { numberOfUsers: numberOfUsers, roomStats: roomStats, issueStats: issueStats, bookings: bookings, roomStatusStats: roomStatusStats, roomIssueStats: roomIssueStats, topFiveRooms: topFiveRooms, highestRatedRooms: highestRatedRooms });
	}

	/****************************************
				ADMIN Functions
	****************************************/

	/**
	*
	* Retrieve the number of users using the application.
	*
	* @param {view}
	*
	*/
	async getNumberofUsers () {
		// retrieves all the users form the database
		const results = await User.all();
		const users = results.toJSON();

		// return the number of users
		return users.length;
	}

	/**
	*
	* Retrieve the number of rooms in the database.
	*
	* @param {view}
	*
	*/
	async getRoomStats () {
		// retrieves all the users form the database
		const results = await Room.all();
		const rooms = results.toJSON();

		// Retrieve number of active rooms
		let countActive = await Room
			.query()
			.where('state', 1)
			.count();

		var stats = {};
		stats['numberOfRooms'] = rooms.length;
		stats['percentageOfActiveRooms'] = Math.round((countActive[0]['count(*)'] / rooms.length) * 100);

		// return the number of users
		return stats;
	}

	/**
	*
	* Retrieve the number of rooms in the database.
	*
	* @param {view}
	*
	*/
	async getIssueStats () {
		// retrieves all the users form the database
		const results = await Report.all();
		const issues = results.toJSON();

		// return the number of users
		return issues.length;
	}

	/**
	*
	* Retrieve the bookings every months for the past six months.
	*
	* @param {view}
	*
	*/
	async getBookings () {
		// initialize the moment.js object to act as our date
		const date = moment();

		// initialize two arrays- the first for the labels of the chart, and the second the data
		const numberOfBookings = [];
		const months = [];

		// queries the bookings table to retrieve the bookings for the past 6 months
		for (let i = 0; i < 6; i++) {
			let bookings = await Booking
				.query()
				.whereRaw("strftime('%Y-%m', bookings.'from') < ?", [date.format('YYYY-MM')]) // eslint-disable-line
				.count();

			numberOfBookings.push(bookings[0]['count(*)']);
			months.push(date.format('MMM YYYY'));

			date.subtract(1, 'M');
		}

		// reverses the order of the array so the months are in ascending order
		numberOfBookings.reverse();
		months.reverse();

		// store the arrays in a dictionary
		var bookingsData = {};
		bookingsData['numberOfBookings'] = numberOfBookings;
		bookingsData['months'] = months;

		// return the number of data
		return bookingsData;
	}

	/**
	*
	* Retrieve the number of active, under maintenance, and deactivated rooms in the database.
	*
	* @param {view}
	*
	*/
	async getRoomStatusStats () {
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
		stats['total'] = countActive[0]['count(*)'] + countDeactive[0]['count(*)'] + countMaint[0]['count(*)'];
		stats['active'] = countActive[0]['count(*)'];
		stats['deactive'] = countDeactive[0]['count(*)'];
		stats['maintenance'] = countMaint[0]['count(*)'];

		return stats;
	}

	/**
	*
	* Retrieve the number of pending, under review, and deactivated rooms in the database.
	*
	* @param {view}
	*
	*/
	async getRoomIssueStats () {
		// Retrieve number of issues that are pending
		let countPending = await Report
			.query()
			.where('report_status_id', 1)
			.count();

		// Retrieve number of issues that are under review
		let countUnderReview = await Report
			.query()
			.where('report_status_id', 2)
			.count();

		// Retrieve number of issues that are resolved
		let countResolved = await Report
			.query()
			.where('report_status_id', 3)
			.count();

		// Create statistic array with custom keys
		var stats = {};
		stats['total'] = countPending[0]['count(*)'] + countUnderReview[0]['count(*)'] + countResolved[0]['count(*)'];
		stats['pending'] = countPending[0]['count(*)'];
		stats['underReview'] = countUnderReview[0]['count(*)'];
		stats['resolved'] = countResolved[0]['count(*)'];

		return stats;
	}

	/**
	*
	* Retrieve the top five rooms with the most bookings.
	*
	* @param {view}
	*
	*/
	async getRoomPopularity () {
		// Retrieves the top five rooms with the highest number of bookings
		let bookings = await Booking
			.query()
			.select('room_id')
			.count('room_id as total')
			.orderBy('total', 'desc')
			.groupBy('room_id')
			.limit(5);

		var topFiveRooms = [];

		// Populate the rooms array with the top five room objects
		for (var i = 0; i < bookings.length; i++) {
			var rooms = {};
			rooms['room'] = await Room.findBy('id', bookings[i]['room_id']);
			rooms['bookings'] = bookings[i]['total'];

			topFiveRooms.push(rooms);
		}

		return topFiveRooms;
	}

	/**
	*
	* Retrieve the top five highest rated rooms.
	*
	* @param {view}
	*
	*/
	async getRoomRatings () {
		// Retrieves the top five highest rated rooms
		let ratings = await Review
			.query()
			.select('*')
			.avg('rating as avgRating')
			.orderBy('avgRating', 'desc')
			.count('review as totalReviews')
			.groupBy('room_id')
			.limit(5)
			.innerJoin('rooms', 'reviews.room_id', 'rooms.id');

		return ratings;
	}

	/****************************************
				User Functions
	****************************************/

	/**
	*
	* Retrieve currently available rooms and returns and array of size 2 with results
	* User's Floor and Tower > User's Floor and ¬ Tower > User's Floor-1 and Tower > User's Floor+1 and Tower > User's Floor-1 and ¬ Tower
	*
	* @param {view}
	*
	*/
	async getAvailableRooms ({ auth, view }) {
		let towerOrder;
		// If the tower is West then set the order to descending, else ascending
		towerOrder = (await auth.user.getUserTower() === 'West') ? 'desc' : 'asc';

		// look for rooms that are open
		// order all rooms in the database by closest to the user's floor and tower
		// order by ascending seats number and fetch results
		let searchResults = await Room
			.query()
			.where('state', 1)
			.orderByRaw('ABS(floor-' + auth.user.floor + ') ASC')
			.orderBy('tower', towerOrder)
			.orderBy('seats', 'asc')
			.fetch();
		const rooms = searchResults.toJSON();

		const date = moment().format('YYYY-MM-DD');
		const from = moment().startOf('h').format('HH:mm');
		const to = moment().startOf('h').add(2, 'h').format('HH:mm');

		const code = random(4);
		const checkRoomAvailability = async () => {
			let numberOfRooms = 2;
			await asyncForEach(rooms, async (item) => {
				if (numberOfRooms !== 0 && await this.getRoomAvailability(date, from, to, item.calendar)) {
					Event.fire('send.room', {
						card: view.render('components.smallCard', { room: item }),
						code: code
					});
					numberOfRooms--;
				}
			});

			if (numberOfRooms === 2) {
				Event.fire('send.empty', {
					code: code
				});
			}
		};

		setTimeout(checkRoomAvailability, 500);
		return code;
	}

	/**
	*
	* Retrieve the user's frew booked rooms and returns and array of size 2 with results and return results
	*
	* @param {view}
	*
	*/
	async getFreqBooked ({ auth }) {
		// get the top 2 freq booked rooms that are available and join with the rooms table to find the room name
		let searchResults = await Booking
			.query()
			.where('user_id', auth.user.id)
			.select('*')
			.count('room_id as total')
			.groupBy('room_id')
			.orderBy('total', 'desc')
			.limit(2)
			.innerJoin('rooms', 'bookings.room_id', 'rooms.id');

		// set the average rating for the rooms
		for (let i = 0; i < searchResults.length; i++) {
			searchResults[i].averageRating = await this.getAverageRating(searchResults[i].id);
		}
		return searchResults;
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

module.exports = HomeController;
