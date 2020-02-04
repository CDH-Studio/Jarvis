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
var moment = require('moment');
require('moment-round');
const Outlook = new (use('App/Outlook'))();

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
				if (!auth.user.verified) {
					return response.route('/profile');
				}
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
	* Change language cookie
	*
	* @param {view}
	*
	*/
	async testAgentConnection ({ params, antl, request, response }) {
		let res = await Outlook.testConnection();
		return res;
	}

	/**
	*
	* Render user dashboard and gather information for dashboard view
	*
	* @param {view}
	*
	*/
	async userDashboard ({ antl, view, auth, request }) {
		const code = randomString(4);
		const freqRooms = await this.getFreqBooked(auth.user);
		const upcoming = await this.getUpcomming(auth.user);
		const userId = auth.user.id;
		const searchValues = await this.loadSearchRoomsForm({ auth });

		var formOptions = {};

		var results = await RoomStatus.query().select('id', 'name').fetch();
		formOptions.statuses = results.toJSON();
		results = await Floor.all();
		formOptions.floors = results.toJSON();
		results = await Tower.all();
		formOptions.towers = results.toJSON();
		results = await RoomFeaturesCategory
			.query()
			.with('features', (builder) => {
				builder.where('building_id', 1);
			})
			.fetch();

		formOptions.roomFeatureCategory = results.toJSON();

		const selectedBuilding = request.cookie('selectedBuilding');

		return view.render('userPages.userDash', {
			code,
			freqRooms,
			upcoming,
			userId,
			fromTime: searchValues.fromTime,
			toTime: searchValues.toTime,
			dropdownSelection: searchValues.dropdownSelection,
			formOptions,
			moment: moment,
			selectedBuilding
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

		console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkk")
		console.log(issueStats)

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

		// queries the users table to retrieve the users for the current and previous month
		let usersRegisteredThisMonth = await User
			.query()
			.where('building_id', selectedBuilding.id)
			.where("created_at", ">=", moment().startOf('month').format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
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

		// Get total number of rooms
		var countRooms = await Room
			.query()
			.where('building_id', selectedBuilding.id)
			.getCount();

		// Retrieve number of active rooms
		let countActiveRooms = await Room
			.query()
			.where('building_id', selectedBuilding.id)
			.where('state_id', 1)
			.getCount();

		var stats = {};
		stats['numberOfRooms'] = countRooms;
		stats['percentageOfActiveRooms'] = Math.round(countActiveRooms/ countRooms) * 100;

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
		// retrieves all issues form the database
		const countIssues = await Report
			.query()
			.where('building_id', selectedBuilding.id)
			.getCount();

		// return the number of issues
		return countIssues;
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

			// set start and end data of time period
			const startOfMonth = date.startOf('month').format('YYYY-MM-DDTHH:mm');
			const endOfMonth = date.endOf('month').format('YYYY-MM-DDTHH:mm');

			let bookings = await Booking
				.query()
				.where('building_id', selectedBuilding.id)
				.where('status', 'Approved')
				.where("from",'>=', startOfMonth)// eslint-disable-line
				.where("from",'<=',endOfMonth)
				.getCount()

			numberOfBookings.push(bookings);
			months.push(date.format('MMM YYYY'));

			date.subtract(1, 'M');
		}
		console.log(numberOfBookings)
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
	* Retrieve the user's frew booked rooms and returns and array of size 2 with results and return results
	*
	* @param {view}
	*
	*/
	async getFreqBooked (user) {

		const Database = use('Database')
		let searchResults = await Booking
		.query()
		.where('user_id', user.id)
		.where('status', 'Approved')
		.select('room_id', 'rooms.id', 'rooms.name', 'rooms.picture_small', 'rooms.avg_rating', 'rooms.capacity', 'rooms.seats')
		.count('room_id as count')
		.groupBy('room_id','rooms.id')
		.orderBy('count', 'desc')
		.innerJoin('rooms', 'bookings.room_id', 'rooms.id')
		.limit(2)

		if (searchResults <= 0) {
			return null;
		} else {
			return searchResults;
		}
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
		let bookings = await Booking
			.query()
			.where('user_id', user.id)
			.where('status', 'Approved')
			.where('from', '>=' , moment().format('YYYY-MM-DDTHH:mm')) // eslint-disable-line
			.select('*')
			.orderBy('from', 'desc')
			.with('room')
			.limit(4)
			.fetch();

		bookings = bookings.toJSON();

		return bookings;
	}
}

module.exports = HomeController;
