'use strict';

/*
|--------------------------------------------------------------------------
| RoomSatusSeeder
|--------------------------------------------------------------------------
|
| Seed table with room statuses
|
*/
const Status = use('App/Models/RoomSatus');

class RoomSatusSeeder {
	async run () {
		var StatusFiller = ['available', 'deactive', 'maintenance'];
		var count = await Status.getCount();

		if (count === 0) {
			for (var i = 0; i < StatusFiller.length; i++) {
				const status = new Status();
				status.name = StatusFiller[i];
				await status.save();
			}
			console.log('Room Status DB: Finished Seeding');
		} else {
			console.log('Room Status DB: Already Seeded');
		}
	}
}

module.exports = RoomSatusSeeder;
