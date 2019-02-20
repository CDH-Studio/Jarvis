'use strict';

class searchRooms {
	get rules () {
		return {
			// validation rules
			date: 'required',
			from: 'required',
			to: 'required'
		};
	}

	// Error messages
	get messages () {
		return {
			'date.required': 'Please enter a valid date',
			'from.required': 'Please enter a starting time',
			'to.required': 'Please enter an end time'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = searchRooms;
