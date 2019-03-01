'use strict';

class ResetPassword {
	get validateAll () {
		return true;
	}

	get rules () {
		return {
			'newPassword': 'required',
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

module.exports = ResetPassword;
