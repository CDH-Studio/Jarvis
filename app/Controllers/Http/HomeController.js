'use strict';

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
	async home (response, auth) {
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
	async adminDashboard (view) {
		return view.render('adminDash');
	}

	/**
	*
	* Render user dashboard
	*
	* @param {view}
	*
	*/
	async userDashboard (view) {
		return view.render('booking');
	}
}

module.exports = HomeController;
