/**
 * File Name: BookRoom.js
 * Description: Validator used to validate input fields in Book Room Page (Employee)
 * Instructions: Use this validator by adding ".validator('BookRoom')" to your route in /routes.js
 **/
'use strict';
const moment = require('moment');

class BookRoom {
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

		return {
			/**
			 * Meeting name validation rules
			 *
			 * required: required field, a meeting name needs to be assigned to book a room
			 */
			meeting: 'required',
			/**
			 * Date validation rules
			 *
			 * after: must be current date or after
			 * before: cannot be more than 3 months ahead of the current date
			 * date: checks if the input field is a valid date
			 * required: require field, cannot book a room without a date entered
			 */
			date: `required|date|after:${minDate}|before:${maxDate}`,
			/**
			 * From and To validation rules
			 *
			 * isAfter: the 'to' field must occur after the 'from' field (custom validator see CustomValidationProvidor.js for more)
			 * isAfterToday: 'from' and 'to' fields must occur after the current time if the date field is the current date
			 * isWithinRange: 'to' field cannot be more than X hours after 'from'
			 * required: require field, cannot book a room without a date entered
			 *
			 */
			from: 'required|isAfterToday:date',
			to: 'required|isAfter:fixedSearchFrom|isAfterToday:date'
			/**
			 * Recurring Validation
			 *
			 * reqrecurringSelected: if the "reccuring" field is selected as YES, these fields are mandatory
			 *
			 */
			// interval: 'recurringSelected:recurringSelect',
			// numberOfTimes: 'recurringSelected:recurringSelect'

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
			'from.timeFormat': 'You may only search with 30 min time intervals, please enter a starting time that ends with 00 or 30',
			'to.isAfter': 'This field must occur after start time',
			'to.isAfterToday': 'This field must occur after the current time',
			'to.timeFormat': 'You may only search with 30 min time intervals, please enter a starting time that ends with 00 or 30',
			'recurringSelected': 'This field is required',
			'required': 'This field is required'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		return this.ctx.response.redirect('back');
	}
}

module.exports = BookRoom;
