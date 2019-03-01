'use strict';

class AddRoom {
	get validateAll () {
		return true;
	}

	get rules () {
		return {
			// validation rules
			name: 'required|unique:rooms',
			fullName: 'required',
			floor: 'required',
			tower: 'required',
			telephoneNumber: 'required',
			tableSeats: 'required|integer',
			maximumCapacity: 'required|integer'
			// floorplan: 'required',
			// picture: 'required'
		};
	}

	// Error messages
	get messages () {
		return {
			'name.required': 'Woah now, Room Name is required.',
			'name.unique': 'Wait a second, this Room Name already exists',
			'fullName.required': 'Woah now, the full name is required.',
			'floor.required': 'Woah now, the floor number is required.',
			'tower.required': 'Woah now, the tower location is required (West/East).',
			'telephoneNumber.required': 'Woah now, Telephone Number is required.',
			'tableSeats.required': 'Woah now, Table Seats is required.',
			'tableSeats.integer': 'Woah now, Table Seats must be a number.',
			'maximumCapacity.required': 'Woah now, Maximum Capacity is required.',
			'maximumCapacity.integer': 'Woah now, Maximum Capacity must be a number.'
			// 'floorplan.required': 'Woah now, a Floor Plan is required.',
			// 'picture.required': 'Woah now, Room Picture is required.'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = AddRoom;
