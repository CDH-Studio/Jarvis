'use strict';
const Room = use('App/Models/Room');
const User = use('App/Models/User');
const Report = use('App/Models/Report');
const Booking = use('App/Models/Booking');
const Review = use('App/Models/Review');
const RoomStatus = use('App/Models/RoomStatus');
const Floor = use('App/Models/Floor');
const Tower = use('App/Models/Tower');
const RoomFeaturesCategory = use('App/Models/RoomFeaturesCategory');
const Event = use('Event');
const Env = use('Env');
var moment = require('moment');
require('moment-round');
const axios = require('axios');

/**
 * Generating a random string.
 *
 * @param {Integer} times Each time a string of 5 to 6 characters is generated.
 */
function randomString (times) {
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
	async home ({ response, auth, request }) {
		try {
			// cheack user is logged-in and role
			await auth.check();
			const userRole = await auth.user.getUserRole();

			if (userRole === 'admin') {
				return response.route('adminDash', { auth });
			} else {
				return response.route('userDash', { auth });
			}
		} catch (error) {
			return response.route('login');
		}
	}

	/**
	*
	* Render language selection page
	*
	* @param {view}
	*
	*/
	async viewLang ({ view }) {
		return view.render('language.langSelect');
	}

	/**
	*
	* Change language cookie
	*
	* @param {view}
	*
	*/
	async changeLang ({ params, antl, request, response }) {
		const locales = antl.availableLocales();
		if (locales.indexOf(params.lang) > -1) {
			response.cookie('lang', params.lang, { path: '/' });
		}
		response.redirect('back');
	}

	/**
	*
	* Render user dashboard and gather information for dashboard view
	*
	* @param {view}
	*
	*/
	async userDashboard ({ view, auth }) {
		const code = await this.getAvailableRooms({ user: auth.user, view });
		const freqRooms = await this.getFreqBooked(auth.user);
		const upcomming = await this.getUpcomming(auth.user);
		const userId = auth.user.id;
		const searchValues = await this.loadSearchRoomsForm({ auth });

		const DBNameSelect = 'name_english as name';

		var formOptions = {};

		var results = await RoomStatus.query().select('id', 'name').fetch();
		formOptions.statuses = results.toJSON();
		results = await Floor.query().select('id', DBNameSelect).fetch();
		formOptions.floors = results.toJSON();
		results = await Tower.query().select('id', DBNameSelect).fetch();
		formOptions.towers = results.toJSON();
		results = await RoomFeaturesCategory
			.query()
			.with('features', (builder) => {
				builder.where('building_id', 1);
			})
			.fetch();

		formOptions.roomFeatureCategory = results.toJSON();

		return view.render('userPages.userDash', {
			code,
			freqRooms,
			upcomming,
			userId,
			fromTime: searchValues.fromTime,
			toTime: searchValues.toTime,
			dropdownSelection: searchValues.dropdownSelection,
			formOptions
		});
	}

	/**
	*
	* Render admin dashboard
	*
	* @param {view}
	*
	*/
	async adminDashboard ({ view, request }) {
		const selectedBuilding = request.cookie('selectedBuilding');

		const userStats = await this.getUserStats(selectedBuilding);
		const roomStats = await this.getRoomStats(selectedBuilding);
		const issueStats = await this.getIssueStats(selectedBuilding);
		const bookings = await this.getBookings(selectedBuilding);
		const roomStatusStats = await this.getRoomStatusStats(selectedBuilding);
		const roomIssueStats = await this.getRoomIssueStats(selectedBuilding);
		const topFiveRooms = await this.getRoomPopularity(selectedBuilding);
		const highestRatedRooms = await this.getTopRatedRooms(selectedBuilding);

		return view.render('adminPages.adminDash', {
			userStats,
			roomStats,
			issueStats,
			bookings,
			roomStatusStats,
			roomIssueStats,
			topFiveRooms,
			highestRatedRooms });
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
	async getUserStats (selectedBuilding) {
		// retrieves all the users form the database
		const allUsers = await User.getCount();
		// const allUsers = results.toJSON();

		// initialize the moment.js object to act as our date
		const date = moment();

		// queries the users table to retrieve the users for the current and previous month
		let usersRegisteredThisMonth = await User
			.query()
			.where('building_id', selectedBuilding.id)
			.whereRaw("strftime('%Y-%m', created_at) = ?", [date.format('YYYY-MM')]) // eslint-disable-line
			.getCount();

		// let usersRegisteredThisMonth = users;
		let usersRegisteredBeforeThisMonth = allUsers - usersRegisteredThisMonth;

		var stats = {};
		stats['numberOfUsers'] = allUsers;
		stats['haveUsersIncreased'] = true;

		let differenceInUsers = usersRegisteredThisMonth - usersRegisteredBeforeThisMonth;
		stats['increaseOfUsers'] = Math.round((differenceInUsers / allUsers) * 100);

		// return the number of users and pourcentage of the increase of users from last month to the current one
		return stats;
	}

	/**
	*
	* Retrieve the number of rooms in the database.
	*
	* @param {view}
	*
	*/
	async getRoomStats (selectedBuilding) {
		var rooms = await Room
			.query()
			.where('building_id', selectedBuilding.id)
			.fetch();

		rooms = rooms.toJSON();

		// Retrieve number of active rooms
		let countActive = await Room
			.query()
			.where('building_id', selectedBuilding.id)
			.where('state_id', 1)
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
	async getIssueStats (selectedBuilding) {
		// retrieves all the users form the database
		const results = await Report
			.query()
			.where('building_id', selectedBuilding.id)
			.fetch();

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
	async getBookings (selectedBuilding) {
		// initialize the moment.js object to act as our date
		const date = moment();

		// initialize two arrays- the first for the labels of the chart, and the second the data
		const numberOfBookings = [];
		const months = [];

		// queries the bookings table to retrieve the bookings for the past 6 months
		for (let i = 0; i < 6; i++) {
			let bookings = await Booking
				.query()
				.where('building_id', selectedBuilding.id)
				.whereRaw("strftime('%Y-%m', bookings.'from') = ?", [date.format('YYYY-MM')]) // eslint-disable-line
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
	async getRoomStatusStats (selectedBuilding) {
		// Retrieve number of active rooms
		let countActive = await Room
			.query()
			.where('building_id', selectedBuilding.id)
			.where('state_id', 1)
			.count();

		// Retrieve number of deactive rooms
		let countDeactive = await Room
			.query()
			.where('building_id', selectedBuilding.id)
			.where('state_id', 2)
			.count();

		// Retrieve number of rooms under maintenance
		let countMaint = await Room
			.query()
			.where('building_id', selectedBuilding.id)
			.where('state_id', 3)
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
	* Retrieve the number of open, pending, and closed issues for graph.
	*
	* @param {view}
	*
	*/
	async getRoomIssueStats (selectedBuilding) {
		// Retrieve number of issues that are pending
		let countPending = await Report
			.query()
			.where('building_id', selectedBuilding.id)
			.where('report_status_id', 1)
			.count();

		// Retrieve number of issues that are under review
		let countUnderReview = await Report
			.query()
			.where('building_id', selectedBuilding.id)
			.where('report_status_id', 2)
			.count();

		// Retrieve number of issues that are resolved
		let countResolved = await Report
			.query()
			.where('building_id', selectedBuilding.id)
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
	async getRoomPopularity (selectedBuilding) {
		// Retrieves the top five rooms with the highest number of bookings
		let bookings = await Booking
			.query()
			.where('building_id', selectedBuilding.id)
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
	async getTopRatedRooms (selectedBuilding) {
		// get top 5 rated rooms
		let topRatedRooms = await Room.query().where('building_id', selectedBuilding.id).orderBy('avg_rating', 'desc').limit(5).fetch();
		topRatedRooms = topRatedRooms.toJSON();

		// get review counts for each room
		for (var index = 0; index < topRatedRooms.length; index++) {
			topRatedRooms[index].totalReviews = await Review.query().where('room_id', topRatedRooms[index].id).getCount();
		}

		return topRatedRooms;
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
	async getAvailableRooms ({ user, view }) {
		// If the tower is West then set the order to descending, else ascending
		let towerOrder = (await user.getUserTower() === 'West') ? 'asc' : 'desc';

		// look for rooms that are open
		// order all rooms in the database by closest to the user's floor and tower
		// order by ascending seats number and fetch results
		// TODO: floor_id -> floor, tower_id
		let searchResults = await Room
			.query()
			.where('state_id', 1)
			.orderByRaw('ABS(floor_id-' + user.floor_id + ') ASC')
			.orderBy('tower_id', towerOrder)
			.orderBy('seats', 'asc')
			.fetch();
		const rooms = searchResults.toJSON();

		const now = moment();
		const remainder = 30 - (now.minute() % 30);
		const date = moment().format('YYYY-MM-DD');
		const from = moment(now).add(remainder, 'm').format('HH:mm');
		const to = moment(now).add(remainder, 'm').add(1, 'h').format('HH:mm');
		const formattedDate = moment().format('dddd, MMMM DD, YYYY');
		const formattedFrom = moment(now).add(remainder, 'm').format('h:mm A');
		const formattedTo = moment(now).add(remainder, 'm').add(1, 'h').format('h:mm A');

		const code = randomString(4);
		const checkRoomAvailability = async () => {
			let numberOfRooms = 2;
			await asyncForEach(rooms, async (item) => {
				if (numberOfRooms !== 0 && await this.getRoomAvailability(date, from, to, item.floor_id, item.calendar)) {
					Event.fire('send.room', {
						card: view.render('components.smallCard', { room: item, datetime: { date: formattedDate, time: formattedFrom + ' - ' + formattedTo } }),
						code: code
					});
					numberOfRooms--;
				}
			});

			if (numberOfRooms === 2) {
				Event.fire('send.empty', {
					view: view.render('components.noAvailableRooms'),
					code: code
				});
			}
		};

		setTimeout(checkRoomAvailability, 800);
		return code;
	}

	/**
	*
	* Retrieve the user's frew booked rooms and returns and array of size 2 with results and return results
	*
	* @param {view}
	*
	*/
	async getFreqBooked (user) {
		// get the top 2 freq booked rooms that are available and join with the rooms table to find the room name
		let searchResults = await Booking
			.query()
			.where('user_id', user.id)
			.select('*')
			.count('room_id as total')
			.groupBy('room_id')
			.orderBy('total', 'desc')
			.innerJoin('rooms', 'bookings.room_id', 'rooms.id')
			.limit(2);

		if (searchResults <= 0) {
			return null;
		} else {
			return searchResults;
		}
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
	*
	* Render Search Room Page and pass the current time for autofill purposes
	*
	* @param {view}
	*
	*/
	async loadSearchRoomsForm ({ view, auth }) {
		// Calculates the from and too times to pre fill in the search form
		let fromTime = moment();
		let toTime = moment();
		let dropdownSelection = [];
		const start = moment().startOf('day');
		const end = moment().endOf('day');

		// round the autofill start and end times to the nearest 30mins
		fromTime = fromTime.round(30, 'minutes').format('HH:mm');
		toTime = toTime.round(30, 'minutes').add(1, 'h').format('HH:mm');

		// loop to fill the dropdown times
		while (start.isBefore(end)) {
			dropdownSelection.push({ dataValue: start.format('HH:mm'), name: start.format('h:mm A') });
			start.add(30, 'm');
		}

		return ({ fromTime, toTime, dropdownSelection });
	}

	/**
	*
	* Render Search Room Page and pass the current time for autofill purposes
	* Retrieve the user's frew booked rooms and returns and array of size 2 with results and return results
	*
	* @param {view}
	*
	*/
	async getUpcomming (user) {
		// get the next 3 upcomming bookings
		let searchResults = await Booking
			.query()
			.where('user_id', user.id)
			.where('status', 'Approved')
			.whereRaw("bookings.'to' >= ?", moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.select('*')
			.orderBy('from', 'asc')
			.innerJoin('rooms', 'bookings.room_id', 'rooms.id')
			.limit(3)
			.fetch();
		// Converting date formats
		searchResults = searchResults.toJSON();
		const bookings = await this.populateBookings(searchResults);

		return bookings;
	}

	/**
	 * Populate bookings from booking query results.
	 *
	 * @param {Object} results Results from bookings query.
	 *
	 * @returns {Object} The access token.
	 *
	 */
	async populateBookings (results) {
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
}

module.exports = HomeController;
