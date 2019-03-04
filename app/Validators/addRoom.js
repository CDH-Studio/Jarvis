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
			/**
			 * Validation Rules
			 *
			 * required: required field, to create a new room these fields are required
			 * unqiue: room 'name' must be unique and cannot conflict with existings rooms
			 * integer: 'tableSeats' and 'maxCapacity' input fields must be a integer, no letters or decimals
			 * above: 'tableSeats' and 'maxCapacity' must be greater than 0
			 */
			name: 'required|unique:rooms',
			fullName: 'required',
			floor: 'required',
			tower: 'required',
			telephoneNumber: 'required',
			tableSeats: 'required|integer|above:0',
			maximumCapacity: 'required|integer|above:0'
			// floorplan: 'required',
			// picture: 'required'
		};
	}

	// Custom error messages
	get messages () {
		return {
			'required': 'This field is required.',
			'above': 'This field must be above 0',
			'name.unique': 'The room name already exists',
			'tableSeats.integer': 'Table Seats must be a number',
			'maximumCapacity.integer': 'Maximum Capacity must be a number'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = AddRoom;
