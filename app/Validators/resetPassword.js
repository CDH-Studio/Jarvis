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
			confirmPassword: 'required|same:newPassword',
			newPassword: 'required'
			// |regex: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$" // eslint-disable-line
		};
	}

	// Custom error messages
	get messages () {
		return {
			'regex': 'Your password must contain at least: 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character',
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
