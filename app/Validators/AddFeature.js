/**
 * File Name: AddRoom.js
 * Description: Validator used to validate input fields in Add Room Page (Admin)
 * Instructions: Use this validator by adding ".validator('AddRoom')" to your route in /routes.js
 **/
'use strict';

class AddRoom {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		return {
			featureName: 'required|max:20',
			featureCategory: 'required|integer',
		};
	}

	// Custom error messages
	get messages () {
		return {
			'featureName.required': 'You must provide a feature name',
			'featureName.max': 'feature name can only be 20 characters long',
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = AddRoom;
