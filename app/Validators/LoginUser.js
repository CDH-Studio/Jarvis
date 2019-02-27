'use strict';

class CreateUser {
	get validateAll () {
		return true;
	}

	get rules () {
		return {
			'email': 'required|email',
			'password': 'required'
		};
	}

	get messages () {
		return {
			'required': 'Woah now, {{ field }} is required.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = CreateUser;
