'use strict';

/*
|--------------------------------------------------------------------------
| RoomSatusSeeder
|--------------------------------------------------------------------------
|
| Seed table with room statuses
|
*/
const Status = use('App/Models/RoomStatus');

class RoomStatusSeeder {
	async run () {
		// load in dummy data for report types
		let reportStatusFiller = require('../seederData/report_statuses.json');

		// count report types in database
		const count = await Status.getCount();

		if (count == 0) {
			for (var i = 0; i < reportStatusFiller.length; i++) {
				const status = new Status();
				status.name = reportStatusFiller[i]['name'];
				await status.save();
			}
			console.log('Room Status DB: Finished Seeding');
		} else {
			console.log('Room Status DB: Already Seeded');
		}
	}
}

module.exports = RoomStatusSeeder;
