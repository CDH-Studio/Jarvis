'use strict';

class BookRoom {
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
		// let currentTime = new Date();
		// let newhour = currentTime.getHours();
		// console.log(newhour);
		// validation rules
		return {
			/**
			 * Meeting name validation rules
			 *
			 * required: require field, a meeting name needs to be assigned to book a room
			 */
			meeting: 'required',
			/**
			 * Date validation rules
			 *
			 * required: require field, cannot book a room without a date entered
			 * date: checks if the input field is a valid date
			 * after: must be current date or after
			 * before: cannot be more than 3 months ahead of the current date
			 */
			date: `required|date|after:${afterDate}|before:${beforeDate}`,
			/**
			 * From and To validation rules
			 *
			 * required: require field, cannot book a room without a date entered
			 * timeFormat: time must end in :00 or :30
			 * isAfter: the 'to' field must occur after the 'from' field (custom validator see CustomValidationProvidor.js for more)
			 * isAfterToday: 'from' and 'to' fields must occur after the current time if the date field is the current date
			 * isWithinRange: 'to' field cannot be more than X hours after 'from'
			 */
			from: 'required|timeFormat|isAfterToday:date',
			to: 'required|timeFormat|isAfter:from|isAfterToday:date',
			/**
			 * Recurring Validation
			 *
			 * reqrecurringSelected: if the "reccuring" field is selected as YES, these fields are mandatory
			 */
			interval: 'recurringSelected:recurringSelect',
			numberOfTimes: 'recurringSelected:recurringSelect'

		};
	}

	// Error messages
	get messages () {
		return {
			'meeting.required': 'This field is required, please enter a meeting name',
			'date.required': 'This field is required, please enter a date',
			'date.date': 'Please enter a valid date',
			'date.dateFormat': 'Please enter a date with the following format: MM/DD/YYYY',
			'date.after': 'Please enter a time in the future',
			'date.before': 'You can only book rooms up to 3 months ahead of time',
			'from.required': 'Please enter a starting time',
			'from.timeFormat': 'You may only search with 30min time intervals, please enter a starting time that ends with 00 or 30.',
			'to.required': 'Please enter an end time',
			'to.timeFormat': 'You may only search with 30min time intervals, please enter a starting time that ends with 00 or 30.',
			'from.isAfterToday': 'This field must occur after the current time',
			'to.isAfterToday': 'This field must occur after the current time',
			'recurringSelected': 'This field is required'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = BookRoom;
