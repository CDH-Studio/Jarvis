/**
 * File Name: SearchRoom.js
 * Description: Validator used to validate input fields Search Room Page (Employee)
 * Instructions: Use this validator by adding ".validator('SearchRoom')" to your route in /routes.js
 **/
'use strict';

class SearchFixed {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		// getting the current date subract 1 day
		let minDate = new Date();
		minDate.setDate(minDate.getDate() - 1);
		//  getting the current date plus 3 months
		let maxDate = new Date();
		maxDate.setDate(maxDate.getDate() + 1);
		maxDate.setMonth(maxDate.getMonth() + 3);

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
			date: `required|date|after:${minDate}|before:${maxDate}`,
			/**
			 * From and To validation rules
			 *
			 * isAfterToday: 'from' and 'to' fields must occur after the current time if the date field is the current date
			 * required: require field, cannot search without a date entered
			 */
			from: 'required|isAfterToday:date',
			duration: 'required|range:0,24'

		};
	}

	// Custom error messages
	get messages () {
		return {
			'date.after': 'Please enter a time in the future',
			'date.before': 'You can only book rooms up to 3 months ahead of time',
			'date.date': 'Please enter a valid date',
			'from.isAfterToday': 'This field must occur after the current time',
			'required': 'This field is required'
		};
	}

	async fails (error) {
		let searchType = { field: 'searchType', message: 'fixed' };
		error.push(searchType);
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = SearchFixed;
