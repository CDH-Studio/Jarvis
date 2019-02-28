'use strict';

class CreateUser {
	get validateAll () {
		return true;
	}

	get rules () {
		return {
			'firstname': 'required',
			'lastname': 'required',
			'email': 'required|unique:users',
			'password': 'required',
			'confirmPassword': 'required|same:password',
			'tower': 'required',
			'floor': 'required'
		};
	}

	get messages () {
		return {
			'required': 'Woah now, {{ field }} is required.',
			'unique': 'Wait a second, this {{ field }} already exists',
			'same': 'Passwords did not match'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = CreateUser;
