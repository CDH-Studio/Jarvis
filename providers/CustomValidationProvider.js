'use strict';

const { ServiceProvider } = require('@adonisjs/fold');

class CustomValidationProvider extends ServiceProvider {
	/**
	 * Register namespaces to the IoC container
	 *
	 * @method register
	 *
	 * @return {void}
	 */
	register () {
		//
	}

	/**
	 * Attach context getter when all providers have
	 * been registered
	 *
	 * @method boot
	 *
	 * @return {void}
	 */
	boot () {
		// require Validator
		const Validator = use('Validator');
		// Register
		Validator.extend('timeFormat', this._timeFormat, '');
		Validator.extend('isAfter', this._isAfter, '');
		Validator.extend('isAfterToday', this._isAfterToday, '');
		Validator.extend('isWithinRange', this._isWithinRange, '');
		Validator.extend('requiredDropdown', this._requiredDropdown, '');
	}

	/* Validate if time ends in 00 or 30
	*
	* @usage timeFormat
	*/
	async _timeFormat (data, field, message, args, get) {
		const timeInput = get(data, field);
		let endsWith = timeInput.slice(-2);
		// If time doesn't end with 00 or 30
		if (endsWith != 30 && endsWith != 0) { // eslint-disable-line
			throw message;
		}
	}

	/* Validate to check if {{ field }} come before {{args}}
	*
	* @usage isAfter
	*/
	async _isAfter (data, field, message, args, get) {
		const before = get(data, field);
		let after = get(data, args[0]);
		if (before <= after) {
			if (after.slice(0, 2) < 12) {
				after += ' AM';
			} else {
				after = (after.substr(0, 2) - 12) + after.substr(2) + ' PM';
			}
			throw new Error('This field must occur after ' + after);
		}
	}

	/* Validate to check if {{args}} and current Date is the same, then make sure the {{field}} is after the current time
	*
	* @usage isAfter
	*/
	async _isAfterToday (data, field, message, args, get) {
		const inputTime = get(data, field);
		const inputDate = get(data, args[0]);
		const currentDate = new Date();
		let currentTime = ('0' + (currentDate.getHours())).slice(-2) + ':' + ('0' + (currentDate.getMinutes())).slice(-2);
		const newCurrentDate = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + currentDate.getDate();

		// if the current date and the search date is the same, check that the times are NOT in the past
		if (inputDate === newCurrentDate && inputTime < currentTime) {
			throw message;
		}
	}

	/* Validate to check if {{args}} and {{field}} are not more than "bookingLimit" - X hours apart
	*
	* @usage isWithinRange
	*/
	async _isWithinRange (data, field, message, args, get) {
		const bookingLimit = 5;
		const userInput = get(data, field);
		const fromTime = get(data, args[0]);
		let difference;
		if (fromTime.slice(-2) === userInput.slice(-2)) {
			difference = userInput.slice(0, 2) - fromTime.slice(0, 2);
		} else if (fromTime.slice(-2) === '30' && userInput.slice(-2) === '00') {
			difference = userInput.slice(0, 2) - fromTime.slice(0, 2) - 0.5;
		} else {
			difference = userInput.slice(0, 2) - fromTime.slice(0, 2) + 0.5;
		}
		console.log(difference);
		if (difference > bookingLimit) {
			throw message;
		}
	}

	/* Validate to check if {{field}} is selected when {{args}} is selected as YES
	*
	* @usage recurringSelected
	*/
	async _recurringSelected (data, field, message, args, get) {
		const userSelection = get(data, field);
		const recurringSelection = get(data, args[0]);
		// if the reccuringSelection is 1 (Yes) and userSelection 0 ("Select X" aka value not selected) throw an error
		if (recurringSelection === '1' && userSelection === '0') {
			throw message;
		}
	}

	/* Validate to check if {{ field }} dropdown is selected on "Select a ___", if so throw message
	*
	* @usage requiredDropdown
	*/
	async _requiredDropdown (data, field, message, args, get) {
		const userSelection = get(data, field);
		if (userSelection === 'undefined') {
			throw message;
		}
	}
}
module.exports = CustomValidationProvider;
