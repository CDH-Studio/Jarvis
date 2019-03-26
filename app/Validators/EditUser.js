/**
 * File Name: CreateUser.js
 * Description: Validator used to validate input fields in User Registration Page (Employee)
 * Instructions: Use this validator by adding ".validator('CreateUser')" to your route in /routes.js
 **/
'use strict';

class EditUser {
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
			 * max: limits the amount of characters to 50
			 * required: required field, to register an account, these fields are required
			 * requiredDropdown: this field is required and cannot be selected on "Select a ___" which has a value of 'undefined'
			 * same: confirmation password must math the password
			 * unique: email must be unique and must not already exist within the database
			 *
			 */

			// email: 'required|email|unique:users',
			firstName: 'required|max:50',
			lastName: 'required|max:50',
			floor: 'required|integer|requiredDropdown',
			tower: 'required|integer|requiredDropdown'
		};
	}
	// Custom error messages
	get messages () {
		return {
			// 'email': 'Please enter a valid e-mail address (somebody@example.com)',
			'max': 'Please limit input to 50 characters.',
			'integer': 'Must be a number.',
			'required': 'This field is required.',
			'requiredDropdown': 'This field is required.',
			'unique': 'The {{ field }} already exists.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = EditUser;
