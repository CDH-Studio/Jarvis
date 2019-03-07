/**
 * File Name: EditRoom.js
 * Description: Validator used to validate input fields in Add Room Page (Admin)
 * Instructions: Use this validator by adding ".validator('EditRoom')" to your route in /routes.js
 **/
'use strict';

class EditRoom {
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
			 * above: 'tableSeats' and 'maxCapacity' must be greater than 0
			 * file: ensures fields like 'floorPlan' and 'roomPicture' are valid files
			 * file_ext: ensures 'floorPlan' and 'roomPicture' files must be a png or jpg/jpeg
			 * file_size: limits 'floorPlan' and 'roomPicture' files to max 2mb
			 * file_types: 'floorPlan' and 'roomPicture' files must be a image type
			 * integer: 'tableSeats' and 'maxCapacity' input fields must be a integer, no letters or decimals
			 * regex: format for phonenumbers, can be (613) 123 4567, 6131234567, +1 613 123 4567, 613-123-4567, etc *****NOT Implemented becasue of {} problems
			 * required: required field, to create a new room these fields are required
			 * requiredDropdown: this field is required and cannot be selected on "Select a ___" which has a value of 'undefined'
			 * unqiue: room 'name' must be unique and cannot conflict with existings rooms
			 *
			 */
			floor: 'required|requiredDropdown',
			floorPlan: 'required|file|file_ext:png,jpg,jpeg|file_size:2mb|file_types:image',
			fullName: 'required',
			roomPicture: 'required|file|file_ext:png,jpg,jpeg|file_size:2mb|file_types:image',
			tableSeats: 'required|integer|above:0',
			telephoneNumber: 'required',
			// telephoneNumber: "required| regex: ^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$",
			tower: 'required|requiredDropdown',
			maximumCapacity: 'required|integer|above:0',
			name: 'required'
		};
	}

	// Custom error messages
	get messages () {
		return {
			'above': 'This field must be above 0',
			'file': 'This field must be an image file',
			'file_ext': 'The file must be .png, .jpg, or jpeg',
			'file_types': 'This field must be an image file',
			'required': 'This field is required.',
			'requiredDropdown': 'This field is required.',
			'tableSeats.integer': 'Table Seats must be a number',
			'telephoneNumber.regex': 'The number must follow the following formate 613-123-4567 or (613) 123-4567',
			'maximumCapacity.integer': 'Maximum Capacity must be a number',
			'name.unique': 'The room name already exists'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = EditRoom;
