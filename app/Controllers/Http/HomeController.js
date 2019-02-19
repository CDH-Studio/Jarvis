
'use strict';

const view = use('View');

class HomeController {
	async dashboard ({ request, response, auth }) {
		try {
			await auth.check();
			var d = new Date();
			var date = d.toLocaleDateString();
			if (auth.user.role === 1) {
				return view.render('adminDash', { auth, date });
			} else {
				return view.render('userPages.booking', { auth });
			}
		} catch (error) {
			return response.redirect('/login');
		}
	}
}

module.exports = HomeController;
