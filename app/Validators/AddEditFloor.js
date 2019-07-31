/**
 * File Name: AddRoom.js
 * Description: Validator used to validate input fields in Add Room Page (Admin)
 * Instructions: Use this validator by adding ".validator('AddRoom')" to your route in /routes.js
 **/
'use strict';

class AddFloor {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		return {
			floorNameEnglish: 'required|max:20|unique:floors,name_english',
			floorNameFrench: 'required|max:20|unique:floors,name_french'
		};
	}

	// Custom error messages
	get messages () {
		return {
			'required': 'You must provide a floor name in both English and French',
			'max': 'Floor name can only be 20 characters long',
			'unique': 'Floor name already exists.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = AddFloor;
