'use strict';
const Room = use('App/Models/Room');
const moment = require('moment');
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

		let daysOfWeek = options.daysOfWeek;
		daysOfWeek = Array.isArray(daysOfWeek) ? daysOfWeek : [options.daysOfWeek];
		console.log(options);

		const rooms = (await Room
			.query()
			.where('floor_id', '=', options.location)
			.fetch()).toJSON();

		// align start date of recurrence to the forthcoming weekday
		const startDay = daysOfWeek.find(d => (d - moment(options.start).day() >= 0));
		let start;
		if (startDay) {
			start = moment(options.start).day(startDay).format('YYYY-MM-DD');
		} else {
			start = moment(options.start).day(Number(daysOfWeek[0]) + 7).format('YYYY-MM-DD');
		}
		console.log(options.start);
		console.log(daysOfWeek[0]);
		console.log(moment(start).format('YYYY-MM-DD ddd'));

		let results = [];
		const getRoomAvailability = async () => {
			await asyncForEach(rooms, async (room) => {
				const availibility = await Outlook.findAvailRecurring({
					room: room.calendar,
					floor: room.floor_id,
					type: options.type,
					interval: options.weeklyInterval,
					daysOfWeek,
					start,
					end: options.end,
					from: moment(start + ' ' + options.from).format('YYYY-MM-DDTHH:mm'),
					to: moment(start + ' ' + options.to).format('YYYY-MM-DDTHH:mm')
				});

				results.push({ room, availibility });
			});
		};

		await getRoomAvailability();

		// const results = [ { room: { id: 2, name: '101A (E)', fullName: 'IC CONF OTT-235 Queen101A CONF IC', floor_id: 1, tower_id: 1, building_id: 1, telephone: '343-291-3070', seats: 6, capacity: 7, extraEquipment: 'Plasma', comment: ' ', floorplan: 'uploads/floorPlans/101A (E)_floorPlan.png', picture: 'uploads/roomPictures/101A (E)_roomPicture.png', calendar: 'ic.conf-ott-235queen-101a-conf.ic@canada.ca', avg_rating: 0, state_id: 1, created_at: null, updated_at: null }, availibility: [ { date: '2019-08-04', available: true }, { date: '2019-08-06', available: true }, { date: '2019-08-11', available: true }, { date: '2019-08-13', available: true }, { date: '2019-08-18', available: true }, { date: '2019-08-20', available: true }, { date: '2019-08-25', available: true }, { date: '2019-08-27', available: true } ] }, { room: { id: 3, name: '101B (E)', fullName: 'IC CONF OTT-235 Queen101B CONF IC', floor_id: 1, tower_id: 1, building_id: 1, telephone: '343-291-3069', seats: 8, capacity: 8, extraEquipment: 'Plasma', comment: ' ', floorplan: 'uploads/floorPlans/101B (E)_floorPlan.png', picture: 'uploads/roomPictures/101B (E)_roomPicture.png', calendar: 'ic.conf-ott-235queen-101b-conf.ic@canada.ca', avg_rating: 0, state_id: 1, created_at: null, updated_at: null }, availibility: [ { date: '2019-08-04', available: true }, { date: '2019-08-06', available: false }, { date: '2019-08-11', available: true }, { date: '2019-08-13', available: false }, { date: '2019-08-18', available: true }, { date: '2019-08-20', available: true }, { date: '2019-08-25', available: true }, { date: '2019-08-27', available: false } ] }, { room: { id: 4, name: '105A (E)', fullName: 'IC CONF OTT-235 Queen105A CONF IC', floor_id: 1, tower_id: 1, building_id: 1, telephone: '343-291-3083', seats: 10, capacity: 26, extraEquipment: ' ', comment: ' ', floorplan: 'uploads/floorPlans/105A (E)_floorPlan.png', picture: 'uploads/roomPictures/105A (E)_roomPicture.png', calendar: 'ic.conf-ott-235queen-105a-conf.ic@canada.ca', avg_rating: 0, state_id: 1, created_at: null, updated_at: null }, availibility: [ { date: '2019-08-04', available: true }, { date: '2019-08-06', available: true }, { date: '2019-08-11', available: true }, { date: '2019-08-13', available: true }, { date: '2019-08-18', available: true }, { date: '2019-08-20', available: true }, { date: '2019-08-25', available: true }, { date: '2019-08-27', available: true } ] }, { room: { id: 5, name: '145A (E)', fullName: 'IC CONF OTT-235 Queen145A CONF IC', floor_id: 1, tower_id: 1, building_id: 1, telephone: '343-291-3248', seats: 6, capacity: 7, extraEquipment: ' ', comment: ' ', floorplan: 'uploads/floorPlans/145A (E)_floorPlan.png', picture: 'uploads/roomPictures/145A (E)_roomPicture.png', calendar: 'ic.conf-ott-235queen-145a-conf.ic@canada.ca', avg_rating: 0, state_id: 1, created_at: null, updated_at: null }, availibility: [ { date: '2019-08-04', available: true }, { date: '2019-08-06', available: true }, { date: '2019-08-11', available: true }, { date: '2019-08-13', available: true }, { date: '2019-08-18', available: true }, { date: '2019-08-20', available: true }, { date: '2019-08-25', available: true }, { date: '2019-08-27', available: true } ] }, { room: { id: 6, name: '165A (W)', fullName: 'IC CONF OTT-235 Queen165A CONF IC', floor_id: 1, tower_id: 2, building_id: 1, telephone: '343-291-2536', seats: 6, capacity: 7, extraEquipment: ' ', comment: '(Collaboration Room)', floorplan: 'uploads/floorPlans/165A (W)_floorPlan.png', picture: 'uploads/roomPictures/165A (W)_roomPicture.png', calendar: 'ic.conf-ott-235queen-165a-conf.ic@canada.ca', avg_rating: 0, state_id: 1, created_at: null, updated_at: null }, availibility: [ { date: '2019-08-04', available: true }, { date: '2019-08-06', available: true }, { date: '2019-08-11', available: true }, { date: '2019-08-13', available: true }, { date: '2019-08-18', available: true }, { date: '2019-08-20', available: true }, { date: '2019-08-25', available: true }, { date: '2019-08-27', available: true } ] }, { room: { id: 7, name: '174A (W)', fullName: 'IC CONF OTT-235 Queen174A CONF IC', floor_id: 1, tower_id: 2, building_id: 1, telephone: '343-291-3723', seats: 7, capacity: 9, extraEquipment: ' ', comment: ' ', floorplan: 'uploads/floorPlans/174A (W)_floorPlan.png', picture: 'uploads/roomPictures/174A (W)_roomPicture.png', calendar: 'ic.conf-ott-235queen-174a-conf.ic@canada.ca', avg_rating: 0, state_id: 1, created_at: null, updated_at: null }, availibility: [ { date: '2019-08-04', available: true }, { date: '2019-08-06', available: true }, { date: '2019-08-11', available: true }, { date: '2019-08-13', available: true }, { date: '2019-08-18', available: true }, { date: '2019-08-20', available: true }, { date: '2019-08-25', available: true }, { date: '2019-08-27', available: true } ] }, { room: { id: 8, name: '199C (W)', fullName: 'IC CONF OTT-235 Queen199C CONF IC', floor_id: 1, tower_id: 2, building_id: 1, telephone: 'Contact IT Service Desk', seats: 9, capacity: 10, extraEquipment: '2 PCS, 2 LED Displays', comment: ' ', floorplan: 'uploads/floorPlans/199C (W)_floorPlan.png', picture: 'uploads/roomPictures/199C (W)_roomPicture.png', calendar: 'ic.conf-ott-235queen-199c-conf.ic@canada.ca', avg_rating: 0, state_id: 1, created_at: null, updated_at: null }, availibility: [ { date: '2019-08-04', available: true }, { date: '2019-08-06', available: true }, { date: '2019-08-11', available: true }, { date: '2019-08-13', available: true }, { date: '2019-08-18', available: true }, { date: '2019-08-20', available: true }, { date: '2019-08-25', available: true }, { date: '2019-08-27', available: true } ] } ];

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
