'use strict';

class searchRooms {
	get validateAll () {
		return true;
	}

	get rules () {
		// getting the current date subract 1 day
		let afterDate = new Date();
		afterDate.setDate(afterDate.getDate() - 1);
		//  getting the current date plus 3 months
		let beforeDate = new Date();
		beforeDate.setDate(beforeDate.getDate() + 1);
		beforeDate.setMonth(beforeDate.getMonth() + 3);

		// getting current hour time
		let currentTime = new Date();
		let newhour = currentTime.getHours();
		// console.log(newhour);
		// validation rules
		return {
			/**
			 * Date validation rules
			 *
			 * required: require field, cannot search without a date entered
			 * date: checks if the input field is a valid date
			 * after: must be current date or after
			 * before: cannot be more than 3 months ahead of the current date
			 */
			date: `required|date|after:${afterDate}|before:${beforeDate}`,
			/**
			 * From and To validation rules
			 *
			 * required: require field, cannot search without a date entered
			 * ends_with: time must end in 0
			 * after: must be current date or after
			 * before: cannot be more than 3 months ahead of the current date
			 */
			from: 'required|ends_with:0',
			to: 'required|ends_with:0'
		};
	}

	// Error messages
	get messages () {
		return {
			'date.required': 'This field is required, please enter a date',
			'date.date': 'Please enter a valid date',
			'date.dateFormat': 'Please enter a date with the following format: MM/DD/YYYY',
			'date.after': 'Please enter a time in the future',
			'date.before': 'You can only book rooms up to 3 months ahead of time',
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
