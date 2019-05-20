/**
 * File Name: AddRoom.js
 * Description: Validator used to validate input fields in Add Room Page (Admin)
 * Instructions: Use this validator by adding ".validator('AddRoom')" to your route in /routes.js
 **/
'use strict';

class EditFloor {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		return {
			floorName: 'required|max:20|unique:floors,name',
		};
	}

	// Custom error messages
	get messages () {
		return {
			'floorName.required': 'You must provide a floor name',
			'floorName.max': 'feature name can only be 20 characters long',
			'floorName.unique': 'The floor name already exists.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = EditFloor;
