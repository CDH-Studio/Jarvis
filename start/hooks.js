const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
	const Validator = use('Validator');
	const sameFn = async (data, field, message, args) => {
		if (!data[field]) {
			return
		}

		for (let arg in args) {
			if (data[field] !== data[args[arg]]) {
				throw message
			}
		}
	}

	const onlyFn = async (data, field, message, args) => {
		if (!data[field]) {
			return;
		}

		let count = 0;
		for (let arg in args) {
			if (data[field] !== arg) {
				count++;
				break;
			}
		}

		if(count > 0)
			throw message;
	}

	Validator.extend('same', sameFn);
	Validator.extend('only', onlyFn)
});