'use strict';
const Room = use('App/Models/Room');

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
	* Render admin dashboard
	*
	* @param {view}
	*
	*/
	async adminDashboard ({ view }) {
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

		return view.render('adminDash', { stats: stats });
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
}

module.exports = HomeController;
