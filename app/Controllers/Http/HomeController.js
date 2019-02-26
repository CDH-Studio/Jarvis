
'use strict';

class HomeController {
	async dashboard ({ response, auth, session }) {
		try {
			await auth.check();
			var d = new Date();
			var date = d.toLocaleDateString();
			if (auth.user.role === 1) {
				session.flash({
					notification: 'You are logged in as an Admin user.'
				});
				return response.route('adminDash', { auth, date });
			} else {
				session.flash({
					notification: 'You are logged in as an Employee user.'
				});
				return response.route('booking', { auth });
			}
		} catch (error) {
			return response.redirect('/login');
		}
	}
}

module.exports = HomeController;
