'use strict';
const Room = use('App/Models/Room');
const User = use('App/Models/User');
const Report = use('App/Models/Report');
const Booking = use('App/Models/Booking');
const Review = use('App/Models/Review');

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
				return response.route('booking');
			}
		} catch (error) {
			return response.route('login');
		}
	}

	/**
	*
	* Render user dashboard
	*
	* @param {view}
	*
	*/
	async userDashboard ({ view }) {
		return view.render('booking');
	}

	/**
	*
	* Render admin dashboard
	*
	* @param {view}
	*
	*/
	async adminDashboard ({ view }) {
		const roomStatusStats = await this.getRoomStatusStats();
		const roomIssueStats = await this.getRoomIssueStats();
		const numberOfUsers = await this.getNumberofUsers();
		const roomStats = await this.getRoomStats();
		const topFiveRooms = await this.getRoomPopularity();
		const highestRatedRooms = await this.getRoomRatings();
		const issueStats = await this.getIssueStats();

		console.log(issueStats);
		return view.render('adminDash', { roomStatusStats: roomStatusStats, roomIssueStats: roomIssueStats, numberOfUsers: numberOfUsers, roomStats: roomStats, issueStats: issueStats, topFiveRooms: topFiveRooms, highestRatedRooms: highestRatedRooms });
	}

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

		var moment = require('moment');
		moment().format();

		// Retrieve number of active rooms
		let countCurrentMonthIssues = await Report
			.query()
			.where('created_at', moment().month())
			.count();

		countCurrentMonthIssues = countCurrentMonthIssues[0]['count(*)'];

		let countPreviousMonthIssues = await Report
			.query()
			.where('created_at', moment().subtract(1, 'months'))
			.count();

		countPreviousMonthIssues = countPreviousMonthIssues[0]['count(*)'];

		console.log(countCurrentMonthIssues);
		console.log(countPreviousMonthIssues);

		// return the number of users
		return issues.length;
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
			.select('room_id')
			.avg('rating as avgRating')
			.orderBy('avgRating', 'desc')
			.count('review as totalReviews')
			.groupBy('room_id')
			.limit(5);

		var topFiveRooms = [];

		// populate the rooms array with the top five room objects
		for (var i = 0; i < ratings.length; i++) {
			var rooms = {};
			rooms['room'] = await Room.findBy('id', ratings[i]['room_id']);
			rooms['averageRating'] = ratings[i]['avgRating'];
			rooms['numberOfReviews'] = ratings[i]['totalReviews'];
			topFiveRooms.push(rooms);
		}

		return topFiveRooms;
	}
}

module.exports = HomeController;
