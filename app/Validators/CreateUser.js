/**
 * File Name: CreateUser.js
 * Description: Validator used to validate input fields in User Registration Page (Employee)
 * Instructions: Use this validator by adding ".validator('CreateUser')" to your route in /routes.js
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
			 * regex: password must conatin at least 1 upper, 1 lower, 1 number, 1 special character (TODO: At least 8 chars)
			 * requiredDropdown: this field is required and cannot be selected on "Select a ___" which has a value of 'undefined'
			 * same: confirmation password must math the password
			 * unique: email must be unique and must not already exist within the database
			 *
			 */
			confirmPassword: 'required|same:password',
			email: 'required|email|unique:users',
			firstname: 'required',
			floor: 'required|requiredDropdown',
			lastname: 'required',
			password:"required", // eslint-disable-line
			// regex: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$
			tower: 'required|requiredDropdown'
		};
	}
	// Custom error messages
	get messages () {
		return {
			'email': 'Please enter a valid e-mail address (somebody@example.com)',
			'regex': 'Your password must contain at least: 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character',
			'required': 'This field is required.',
			'requiredDropdown': 'This field is required.',
			'same': 'Passwords do not match',
			'unique': 'The {{ field }} already exists, try logging in instead'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = CreateUser;
