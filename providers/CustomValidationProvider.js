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
		// Validator.extend('beforeTime', this._beforeTime, '');
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
	/* UNUSED
	*
	*
	*/
	async _beforeTime (data, field, message, args, get) {
		const timeInput = get(data, field);
		//  getting current time to compare with input
		const currentHour = new Date().getHours();
		const currentMinute = new Date().getMinutes();
		const currentTime = '' + currentHour + currentMinute;
		const newTimeInput = timeInput.slice(0, 2) + timeInput.slice(3, 5);
		console.log(newTimeInput);
		// If time doesn't end with 00 or 30
		if (currentTime > startsWith && currentMinute > endsWith) { // eslint-disable-line
			throw message;
		}
	}
}

module.exports = CustomValidationProvider;
