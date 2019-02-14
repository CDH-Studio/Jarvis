'use strict';

class addRoom {
	get rules () {
		return {
			// validation rules
			name: 'required|unique:rooms',
			location: 'required',
			telephoneNumber: 'required',
			tableSeats: 'required|integer',
			maximumCapacity: 'required|integer'
		};
	}

	// Error messages
	get messages () {
		return {
			'name.required': 'Woah now, Room Name is required.',
			'name.unique': 'Wait a second, this Room Name already exists',
			'location.required': 'Woah now, Location is required.',
			'telephoneNumber.required': 'Woah now, Telephone Number is required.',
			'tableSeats.required': 'Woah now, Table Seats is required.',
			'tableSeats.integer': 'Woah now, Table Seats must be a number.',
			'maximumCapacity.required': 'Woah now, Maximum Capacity is required.',
			'maximumCapacity.integer': 'Woah now, Maximum Capacity must be a number.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = addRoom;
