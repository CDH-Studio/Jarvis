'use strict';
const Env = use('Env');
const Room = use('App/Models/Room');
const moment = require('moment');
const recur = require('moment-recur');
const Outlook = new (use('App/Outlook'))();

class RecurController {
	async renderRecurring ({ view }) {
		return view.render('userPages.recurringBooking');
	}

	async searchRecurring ({ request }) {
		// console.log(Env.get('EXCHANGE_AGENT_SERVER', 'http://172.17.75.10:3000'));
		const options = request.all();
		console.log(options);

		const rooms = await (Room
			.query()
			.where('floor_id', '=', options.location)
			.fetch()).toJSON();

		
		// const ret = Outlook.findAvailRecurring({
		// 	type: options.type,
		// 	start: options.start,
		// 	end: options.end,
		// 	from: moment(options.start + ' ' + options.from).format('YYYY-MM-DDTHH:mm'),
		// 	to: moment(options.start + ' ' + options.to).format('YYYY-MM-DDTHH:mm')
		// });


		return rooms.toJSON();
	}

	async generateRucurringDates ({ request }) {
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
			dates = dates
				.filter((date) => {
					return (date.week() - firstWeek) % options.weeklyInterval === 0;
				});
			// .map((date) => {
			// return { from };
			// });
			console.log(dates);
			return recur;
		}
	}
}

module.exports = RecurController;
