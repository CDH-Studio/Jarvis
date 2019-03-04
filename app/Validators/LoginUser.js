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
			 * required: required field, to register an account, these fields are required
			 * email: must be a valid email format
			 */
			'email': 'required|email',
			'password': 'required'
		};
	}

	// Custom error messages
	get messages () {
		return {
			'required': 'This field is required',
			'email': 'Please enter a valid e-mail address (somebody@example.com)'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = CreateUser;
