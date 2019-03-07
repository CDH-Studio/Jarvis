'use strict';

class HomeController {
	async home ({ response, auth }) {
		try {
			await auth.check();
			var d = new Date();
			var date = d.toLocaleDateString();
			if (auth.user.role === 1) {
				return response.route('adminDash');
			} else {
				return response.route('booking');
			}
		} catch (error) {
			return response.redirect('/login');
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
