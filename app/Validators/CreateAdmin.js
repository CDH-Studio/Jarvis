'use strict';
const Env = use('Env');

class CreateAdmin {
	get validateAll () {
		return true;
	}

	get rules () {
		const secretToken = Env.get('ADMIN_TOKEN', '666');
		return {
			firstname: 'required',
			lastname: 'required',
			email: 'required|email|unique:users',
			password: 'required',
			confirmPassword: 'required|same:password',
			token: `required|equals:${secretToken}`
		};
	}

	get messages () {
		return {
			'required': 'Woah now, {{ field }} is required.',
			'unique': 'Wait a second, the {{ field }} already exists',
			'equals': 'Token incorrect'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = CreateAdmin;
