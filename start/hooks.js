const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
	const Validator = use('Validator');
	const Env = use('Env');

	// convert postgresql bigint to JS supported data-types
	if (Env.get('DB_CONNECTION') === 'pg') {
		var types = require('pg').types;
		types.setTypeParser(20, function (value) {
			return parseInt(value);
		});
		types.setTypeParser(1700, function (value) {
			return parseFloat(value);
		});
	}

	/**
	 * Validator for making sure the values of input fields match.
	 *
	 * @param {Object} data Data sent through the request.
	 * @param {*} field Name of the field.
	 * @param {*} message Error message for violation.
	 * @param {*} args Arguments pass to the validator function.
	 */
	const sameFn = async (data, field, message, args) => {
		if (!data[field]) {
			return;
		}

		for (let arg in args) {
			if (data[field] !== data[args[arg]]) {
				throw message;
			}
		}
	};

	Validator.extend('same', sameFn);

	/**
	 * Validator for limiting values of an input field.
	 *
	 * @param {Object} data Data sent through the request.
	 * @param {*} field Name of the field.
	 * @param {*} message Error message for violation.
	 * @param {*} args Arguments pass to the validator function.
	 */
	const onlyFn = async (data, field, message, args) => {
		if (!data[field]) {
			return;
		}

		let match = false;
		for (let arg in args) {
			if (data[field] === arg) {
				match = true;
				break;
			}
		}

		if (!match) {
			throw message;
		}
	};

	Validator.extend('only', onlyFn);
});
