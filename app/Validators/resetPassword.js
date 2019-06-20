/**
 * File Name: ResetPassword.js
 * Description: Validator used to validate input fields in Reset Password Page (Any)
 * Instructions: Use this validator by adding ".validator('ResetPassword')" to your route in /routes.js
 **/
'use strict';

class ResetPassword {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		return {
			/**
			 * Validation Rules
			 *
			 * regex: password must conatin at least 1 upper, 1 lower, 1 number, 1 special character (TODO: At least 8 chars)
			 * required: required field, to register an account, these fields are required
			 * same: password and confirmation passwords must match
			 */
			newPassword: 'required|regexPassword',
			confirmPassword: 'required|same:newPassword|regexPassword',
		};
	}

	// Custom error messages
	get messages () {
		return {
			'regexPassword': 'Your password must be at least 6 characters',
			'required': 'This field is required',
			'same': 'Passwords do not match.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = ResetPassword;
