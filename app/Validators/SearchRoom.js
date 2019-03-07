/**
 * File Name: SearchRoom.js
 * Description: Validator used to validate input fields Search Room Page (Employee)
 * Instructions: Use this validator by adding ".validator('SearchRoom')" to your route in /routes.js
 **/
'use strict';

class SearchRoom {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		// getting the current date subract 1 day
		let afterDate = new Date();
		afterDate.setDate(afterDate.getDate() - 1);
		//  getting the current date plus 3 months
		let beforeDate = new Date();
		beforeDate.setDate(beforeDate.getDate() + 1);
		beforeDate.setMonth(beforeDate.getMonth() + 3);

		// Validation rules
		return {
			/**
			 * Date validation rules
			 *
			 * after: must be current date or after
			 * before: cannot be more than 3 months ahead of the current date
			 * date: checks if the input field is a valid date
			 * required: require field, cannot search without a date entered
			 */
			date: `required|date|after:${afterDate}|before:${beforeDate}`,
			/**
			 * From and To validation rules
			 *
			 * isAfter: the 'to' field must occur after the 'from' field (custom validator see CustomValidationProvidor.js for more)
			 * isAfterToday: 'from' and 'to' fields must occur after the current time if the date field is the current date
			 * isWithinRange: 'to' field cannot be more than X hours after 'from'
			 * required: require field, cannot search without a date entered
			 * timeFormat: time must end in :00 or :30
			 */
			from: 'required|timeFormat|isAfterToday:date',
			to: 'required|timeFormat|isAfter:from|isAfterToday:date'
		};
	}

	// Custom error messages
	get messages () {
		return {
			'date.after': 'Please enter a time in the future',
			'date.before': 'You can only book rooms up to 3 months ahead of time',
			'date.date': 'Please enter a valid date',
			'date.dateFormat': 'Please enter a date with the following format: MM/DD/YYYY',
			'from.isAfterToday': 'This field must occur after the current time',
			'from.timeFormat': 'You may only search with 30min time intervals, please enter a starting time that ends with 00 or 30.',
			'to.isAfterToday': 'This field must occur after the current time',
			'to.timeFormat': 'You may only search with 30min time intervals, please enter a starting time that ends with 00 or 30.',
			'required': 'This field is required'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = SearchRoom;
