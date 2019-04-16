/**
 * File Name: CreateAdmin.js
 * Description: Validator used to validate input fields in Admin Registration Page (Admin)
 * Instructions: Use this validator by adding ".validator('CreateAdmin')" to your route in /routes.js
 **/
'use strict';
const Env = use('Env');

class CreateAdmin {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		const secretToken = Env.get('ADMIN_TOKEN', '666');
		return {
			/**
			 * Validation Rules
			 *
			 * email: must be a valid email format
			 * max: limits the amount of characters to 50
			 * equals: the token entered must match the generated token
			 * regex: password must conatin at least 1 upper, 1 lower, 1 number, 1 special character (TODO: At least 8 chars)
			 * required: required field, to register an account, these fields are required
			 * same: confirmation password must math the password
			 * unique: email must be unique and must not already exist within the database
			 *
			 */
			confirmPassword: 'required|regexPassword|same:password',
			email: 'required|email|unique:users',
			firstname: 'required|max:50',
			lastname: 'required|max:50',
			password:"required|regexPassword", // eslint-disable-line
			token: `required|equals:${secretToken}`
		};
	}

	// Custom error messages
	get messages () {
		return {
			'email': 'Please enter a valid e-mail address (somebody@example.com)',
			'equals': 'Token incorrect',
			'max': 'Please limit input to 50 characters.',
			'regexPassword': 'Your password must contain at least: 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character and be at least 8 Characters.',
			'required': 'This field is required',
			'same': 'Passwords do not match',
			'unique': 'The {{ field }} already exists, try logging in instead'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = CreateAdmin;
