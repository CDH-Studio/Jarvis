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
			 * integer: 'rating' input field must be a integer, no letters or decimals
			 * max: 'rating' input field must be at least 1
			 * min: 'rating' input field must be at most 5
			 * required: required field, to create a new room these fields are required
			 * requiredDropdown: this field is required and cannot be selected on "Select a ___" which has a value of 'undefined'
			 *
			 */
			rating: 'required|requiredDropdown|integer|min:1|max:5',
			review: 'required|max:250',
			reviewPicture: 'file_ext:png,jpg,jpeg|file_size:2mb|file_types:image'
		};
	}

	// Custom error messages
	get messages () {
		return {
			'file_ext': 'The file must be .png, .jpg, or jpeg',
			'file_types': 'This field must be an image file',
			'required': 'This field is required.',
			'rating.requiredDropdown': 'This field is required.',
			'rating.integer': 'This field must be a number',
			'rating.min': 'The rating must be a least 1.',
			'rating.max': 'The rating must be a most 5.',
			'review.max': 'Please limit your review to 250 characters.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = AddReview;
