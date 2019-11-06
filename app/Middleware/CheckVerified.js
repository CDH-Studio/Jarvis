'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckVerified {
	/**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
	async handle ({ auth, response }, next) {
		if (!auth.user.verified) {
			return response.redirect('/');
		}

		await next();
	}
}

module.exports = CheckVerified;
