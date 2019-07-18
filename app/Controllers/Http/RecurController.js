'use strict';
const axios = require('axios');
const Env = use('Env');
const moment = require('moment');
const recur = require('moment-recur');

class RecurController {
	async renderRecurring ({ view }) {
		return view.render('userPages.recurringBooking');
	}

	async searchRecurring2 ({ request }) {
		const options = request.all();
		console.log(options);

		// start date
		const start = moment(options.start).dateOnly();

		// end date
		const end = moment(options.end).dateOnly();

		// moment-recur object
		let recur = moment().recur({
			start,
			end
		});

		// types of recurring
		if (options.type === 'weekly') {
			recur = recur
				.daysOfWeek(options.daysOfWeek);

			let dates = recur.all();
			console.log(dates);

			const firstWeek = dates[0].week();
			dates = dates.filter((date) => {
				return (date.week() - firstWeek) % options.weeklyInterval === 0;
			});
			console.log(dates);
			return recur;
		}
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
		console.log(recur);
	}
}

module.exports = RecurController;
