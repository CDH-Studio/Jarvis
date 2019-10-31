/**
 * File Name: SearchFlexible.js
 * Description: Validator used to validate input fields for Flexible Search Room form (Employee)
 * Instructions: Use this validator by adding ".validator('SearchRoom')" to your route in /routes.js
 **/
'use strict';
const moment = require('moment');

class SearchFlexible {
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
			flexibleSearchDate: `required|date|after:${minDate}|before:${maxDate}`,
			/**
			 * From and To validation rules
			 *
			 * isAfterToday: 'from' and 'to' fields must occur after the current time if the date field is the current date
			 * required: require field, cannot search without a date entered
			 */
			flexibleSearchFrom: 'required|isAfterToday:flexibleSearchDate',
			flexibleSearchTo: 'required|isAfter:flexibleSearchFrom|isAfterToday:flexibleSearchDate',
			flexibleSearchSeats: 'integer',
			flexibleSearchCapacity: 'integer',
			flexibleSearchDuration: 'required|range:0,24'

		};
	}

	// Custom error messages
	get messages () {
		return {
			'flexibleSearchFrom.isAfterToday': 'This field must occur after the current time',
			'flexibleSearchTo.isAfter()': 'End time must be after Start time',
			'flexibleSearchDate.after': 'Please enter a time in the future',
			'flexibleSearchDate.before': 'You can only book rooms up to 3 months ahead of time',
			'flexibleSearchDate.date': 'Please enter a valid date',
			'required': 'This field is required'
		};
	}

	async fails (error) {
		let searchType = { field: 'searchType', message: 'flexible' };
		error.push(searchType);
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = SearchFlexible;
