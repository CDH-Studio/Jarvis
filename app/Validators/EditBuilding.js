/**
 * File Name: AddRoom.js
 * Description: Validator used to validate input fields in Add Room Page (Admin)
 * Instructions: Use this validator by adding ".validator('AddRoom')" to your route in /routes.js
 **/
'use strict';

class EditBuilding {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		return {
			name: 'required|max:50',
			streetAddress: 'required|max:50',
			postalCode: 'required|max:50',
			city: 'required|max:50'
		};
	}

	get messages () {
		return {
			'required': 'This field is required.'
		};
	}
}

module.exports = EditBuilding;
