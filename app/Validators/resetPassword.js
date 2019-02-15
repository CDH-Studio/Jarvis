'use strict';

class resetPassword {
	get rules () {
		return {
			'password': 'required',
			'confirmPassword': 'required|same:password'
		};
	}

	get messages () {
		return {
			'required': 'Woah now, {{ field }} is required.',
			'same': 'Passwords do not match.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = resetPassword;
