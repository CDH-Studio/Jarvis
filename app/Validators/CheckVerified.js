'use strict';

class CheckVerified {
  async handle ({ auth, response }, next) {
		if (!auth.user.verified) {
			return response.redirect('/');
		}

		await next();
	}
}

module.exports = CheckVerified;
