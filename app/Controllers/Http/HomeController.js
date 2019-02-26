'use strict';

class HomeController {
	async dashboard ({ response, auth }) {
		try {
			await auth.check();
			var d = new Date();
			var date = d.toLocaleDateString();
			if (auth.user.role === 1) {
				return response.route('adminDash', { auth, date });
			} else {
				return response.route('booking', { auth });
			}
		} catch (error) {
			return response.redirect('/login');
		}
	}
}

module.exports = HomeController;
