/**
 * File Name: EditIssue.js
 * Description: Validator used to validate input fields in editing an existing Issue
 * Instructions: Use this validator by adding ".validator('EditIssue')" to your route in /routes.js
 **/
'use strict';

class EditIssue {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		return {
			/**
			 * Validation Rules
			 * max: 'comment' input field is limited to 250 characters
			 * required: required field, to create a new room these fields are required
			 * requiredDropdown: this field is required and cannot be selected on "Select a ___" which has a value of 'undefined'
			 *
			 */

			issueStatus: 'required',
			issueType: 'required|requiredDropdown',
			comment: 'required|max:250'
		};
	}

	// Custom error messages
	get messages () {
		return {
			'required': 'This field is required.',
			'requiredDropdown': 'This field is required.',
			'comment.max': 'Please limit your comment to 250 characters.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = EditIssue;
