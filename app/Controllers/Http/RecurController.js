'use strict';
const axios = require('axios');
const Env = use('Env');
const moment = require('moment');
const recur = require('moment-recur');

class RecurController {
	async searchRecurring2 ({ request }) {
		const options = request.all();
		console.log(options);

		// start date
		const startDate = options.startDate;

		let recur = moment(startDate);
		if (options.type === 'daily') {
			recur = recur
				.recur()
				.every(options.dailyInterval)
				.days();
		} else if (options.type === 'monthly') {
			recur = recur
				.recur()
				.daysOfMonth(options.dayOfMonth);
		} else {
			recur = recur
				.recur()
				.daysOfWeek(options.daysOfWeek);
		}

		console.log(recur.next(3));

		return recur;
	}

	async searchRecurring ({ request }) {
		console.log(Env.get('EXCHANGE_AGENT_SERVER', 'http://172.17.75.10:3000'));
		const options = request.all();
		console.log(options);

		let recurrence = {};
		// Recurrence start date
		recurrence.startDate = options.startDate;

		// Recurrence end date
		if (options.endOption === 'endBy') {
			recurrence.end = options.endDate;
			recurrence.hasEnd = true;
		} else if (options.endOption === 'endAfter') {
			recurrence.numberOfOccurrences = options.numberOfOccurrences;
			recurrence.hasEnd = true;
		} else {
			recurrence.hasEnd = false;
		}

		// Recurrence type
		recurrence.type = options.type;
		if (recurrence.type === 'daily' && options.dailyOption === 'everyWeekday') {
			recurrence.type = 'weekly';
			recurrence.daysOfWeek = [8];

			console.log('recurrence', recurrence);
			const res = await axios.post(`${Env.get('EXCHANGE_AGENT_SERVER', 'http://localhost:3000')}/`, recurrence);

			return res.data;
		}

		switch (recurrence.type) {
			case 'daily':
				recurrence.interval = options.dailyInterval;
				break;
			case 'weekly':
				recurrence.interval = options.weeklyInterval;
				recurrence.daysOfWeek = options.daysOfWeek;
				break;
			case 'monthly':
				recurrence.interval = options.monthlyInterval;
				recurrence.dayOfMonth = options.dayOfMonth;
				break;
			default:
		}

		console.log('recurrence', recurrence);
		const res = await axios.post(`${Env.get('EXCHANGE_AGENT_SERVER', 'http://localhost:3000')}/`, recurrence);

		return res.data;
	}

	async test () {
	}
}

module.exports = RecurController;
