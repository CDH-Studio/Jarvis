/**
 * File Name: SearchFixed.js
 * Description: Validator used to validate input fields for Fixed Search Room form (Employee)
 * Instructions: Use this validator by adding ".validator('SearchRoom')" to your route in /routes.js
 **/
'use strict';
const moment = require('moment');

class SearchFixed {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		// getting the current date subract 1 day
		let minDate = moment().subtract(1, 'days').format();

		//  getting the current date plus 3 months
		let maxDate = moment().add(1, 'days').add(3, 'months').format();

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
			fixedSearchDate: `required|date|after:${minDate}|before:${maxDate}`,
			/**
			 * From and To validation rules
			 *
			 * isAfterToday: 'from' and 'to' fields must occur after the current time if the date field is the current date
			 * required: require field, cannot search without a date entered
			 */
			fixedSearchFrom: 'required|isAfterToday:fixedSearchDate',
			fixedSearchTo: 'required|isAfter:fixedSearchFrom|isAfterToday:fixedSearchDate',
			fixedSearchSeats: 'integer',
			fixedSearchCapacity: 'integer'

		};
	}

	// Custom error messages
	get messages () {
		return {
			'fixedSearchFrom.isAfterToday': 'This field must occur after the current time',
			'fixedSearchTo.isAfter()': 'End time must be after Start time',
			'fixedSearchDate.after': 'Please enter a time in the future',
			'fixedSearchDate.before': 'You can only book rooms up to 3 months ahead of time',
			'fixedSearchDate.date': 'Please enter a valid date',
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
