/**
 * File Name: AddRoom.js
 * Description: Validator used to validate input fields in Add Room Page (Admin)
 * Instructions: Use this validator by adding ".validator('AddRoom')" to your route in /routes.js
 **/
'use strict';

class AddTower {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		return {
			towerNameEnglish: 'required|max:20',
			towerNameFrench: 'required|max:20'
		};
	}

	// Custom error messages
	get messages () {
		return {
			'towerName.required': 'You must provide a tower name',
			'max': 'Tower name can only be 20 characters long',
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = AddTower;
