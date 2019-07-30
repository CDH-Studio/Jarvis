'use strict';
const Env = use('Env');
const Room = use('App/Models/Room');
const moment = require('moment');
const recur = require('moment-recur');
const Outlook = new (use('App/Outlook'))();

async function asyncForEach (arr, callback) {
	for (let i = 0; i < arr.length; i++) {
		await callback(arr[i], i, arr);
	}
}

class RecurController {
	async renderRecurring ({ view }) {
		return view.render('userPages.recurringBooking');
	}

	async searchRecurring ({ request }) {
		const options = request.all();
		options.daysOfWeek = Array.isArray(options.daysOfWeek) ? options.daysOfWeek : [options.daysOfWeek];
		console.log(options);

		const rooms = (await Room
			.query()
			.where('floor_id', '=', options.location)
			.fetch()).toJSON();

		let results = [];

		const getRoomAvailability = async () => {
			await asyncForEach(rooms, async (room) => {
				const ret = await Outlook.findAvailRecurring({
					room: room.calendar,
					floor: room.floor_id,
					type: options.type,
					interval: options.weeklyInterval,
					daysOfWeek: options.daysOfWeek,
					start: options.start,
					end: options.end,
					from: moment(options.start + ' ' + options.from).format('YYYY-MM-DDTHH:mm'),
					to: moment(options.start + ' ' + options.to).format('YYYY-MM-DDTHH:mm')
				});

				results.push({ room, availibility: ret });
			});
		};

		await getRoomAvailability();

		return results;
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
