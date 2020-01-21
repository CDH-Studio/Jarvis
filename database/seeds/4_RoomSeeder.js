'use strict';

/*
|--------------------------------------------------------------------------
| RoomSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Floor = use('App/Models/Room');

class RoomSeeder {
	async run () {
		// load in dummy data for floor
		let roomFiller = require('../seederData/rooms.json');

		// count floors in database
		var count = await Room.getCount();

		if (count == 0) {
			for (var i = 0; i < roomFiller.length; i++) {
				const floor = new Floor();
				floor.id = i === 0 ? '0' : i;
				floor.name_english = roomFiller[i]['name_english'];
				floor.name_french = roomFiller[i]['name_french'];
				floor.building_id = roomFiller[i]['building_id'];
				await floor.save();
			}
			console.log('Floor Name DB: Finished Seeding');
		} else {
			console.log('Floor Name DB: Already Seeded');
		}
	}
}

module.exports = RoomSeeder;
