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
			 * required: required field, to register an account, these fields are required
			 * regex: password must conatin at least 1 upper, 1 lower, 1 number, 1 special character (TODO: At least 8 chars)
			 * same: password and confirmation passwords must match
			 */
			newPassword: "required|regex: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$", // eslint-disable-line
			confirmPassword: 'required|same:password'
		};
	}

	// Custom error messages
	get messages () {
		return {
			'required': 'This field is required',
			'regex': 'Your password must contain at least: 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character',
			'same': 'Passwords do not match.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = ResetPassword;
