/**
 * File Name: LoginUser.js
 * Description: Validator used to validate input fields in Login Page (Any)
 * Instructions: Use this validator by adding ".validator('LoginUser')" to your route in /routes.js
 **/
'use strict';

class CreateUser {
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
			 * email: must be a valid email format
			 * required: required field, to register an account, these fields are required
			 */
			'email': 'required|email',
			'password': 'required'
		};
	}

	// Custom error messages
	get messages () {
		return {
			'email': 'Please enter a valid e-mail address (somebody@example.com)',
			'required': 'This field is required'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = CreateUser;
