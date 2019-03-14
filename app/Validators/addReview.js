/**
 * File Name: AddReview.js
 * Description: Validator used to validate input fields in Add Room Page (Admin)
 * Instructions: Use this validator by adding ".validator('AddReview')" to your route in /routes.js
 **/
'use strict';

class AddReview {
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
			 * required: required field, to create a new room these fields are required
			 * requiredDropdown: this field is required and cannot be selected on "Select a ___" which has a value of 'undefined'
			 *
			 */
			rating: 'required|requiredDropdown'
			// reviewPicture: 'required|file|file_ext:png,jpg,jpeg|file_size:2mb|file_types:image',
		};
	}

	// Custom error messages
	get messages () {
		return {
			'required': 'This field is required.',
			'requiredDropdown': 'This field is required.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = AddReview;
