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
			 * required: required field, to register an account, these fields are required
			 * email: must be a valid email format
			 * unique: email must be unique and must not already exist within the database
			 * regex: password must conatin at least 1 upper, 1 lower, 1 number, 1 special character (TODO: At least 8 chars)
			 * same: confirmation password must math the password
			 * equals: the token entered must match the generated token
			 */
			firstname: 'required',
			lastname: 'required',
			email: 'required|email|unique:users',
			password:"required|regex: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$", // eslint-disable-line
			confirmPassword: 'required|same:password',
			token: `required|equals:${secretToken}`
		};
	}

	// Custom error messages
	get messages () {
		return {
			'required': 'This field is required',
			'email': 'Please enter a valid e-mail address (somebody@example.com)',
			'unique': 'The {{ field }} already exists, try logging in instead',
			'regex': 'Your password must contain at least: 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character',
			'same': 'Passwords do not match',
			'equals': 'Token incorrect'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = CreateAdmin;
