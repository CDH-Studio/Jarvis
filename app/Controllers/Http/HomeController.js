'use strict';

class HomeController {
	async home ({ response, auth }) {
		try {
			await auth.check();
			var d = new Date();
			var date = d.toLocaleDateString();			
		if (await auth.user.getUserRole() == 'admin') {
				return response.route('adminDash', { auth, date });
			} else {
				return response.route('booking');
			}
		} catch (error) {
			return response.route('login');
		}
	}

	async adminDashboard ({ view, response, auth }) {
		var d = new Date();
		var date = d.toLocaleDateString();
		return view.render('adminDash', {date});
	}

	async userDashboard ({ view, response, auth }) {
		var d = new Date();
		var date = d.toLocaleDateString();
		return view.render('booking', { date })
	}
}

module.exports = HomeController;
