const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
	const Validator = use('Validator');
	const sameFn = async (data, field, message, args) => {
		if (!data[field]) {
			return
		}

		if (data[field] !== data[args[0]]) {
			throw message
		}
	}

	Validator.extend('same', sameFn)
});