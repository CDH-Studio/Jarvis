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
		const availRooms = await this.getAvailableRooms({ auth });
		const freqRooms = await this.getFreqBooked({ auth });
		return view.render('userPages.booking', { availRooms, freqRooms });
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
		const numberOfRooms = await this.getNumberofRooms();
		const topFiveRooms = await this.getRoomPopularity();
		const highestRatedRooms = await this.getRoomRatings();

		return view.render('adminDash', { roomStatusStats: roomStatusStats, roomIssueStats: roomIssueStats, numberOfUsers: numberOfUsers, numberOfRooms: numberOfRooms, topFiveRooms: topFiveRooms, highestRatedRooms: highestRatedRooms });
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
	* Retrieve the number of users using the application.
	*
	* @param {view}
	*
	*/
	async getNumberofRooms () {
		// retrieves all the users form the database
		const results = await Room.all();
		const rooms = results.toJSON();

		// return the number of users
		return rooms.length;
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
			.groupBy('room_id')
			.limit(5);

		var topFiveRooms = [];

		// populate the rooms array with the top five room objects
		for (var i = 0; i < ratings.length; i++) {
			var rooms = {};
			rooms['room'] = await Room.findBy('id', ratings[i]['room_id']);
			rooms['averageRating'] = ratings[i]['avgRating'];

			topFiveRooms.push(rooms);
		}

		return topFiveRooms;
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
	async getAvailableRooms ({ auth }) {
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
			.limit(2)
			.fetch();

		return searchResults.toJSON();
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
}

module.exports = HomeController;
