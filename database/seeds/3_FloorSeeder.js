'use strict';

/*
|--------------------------------------------------------------------------
| FloorSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Floor = use('App/Models/Floor');

class FloorSeeder {
	async run () {
		// load in dummy data for floor
		let floorFiller = require('../seederData/floors.json');

		// count floors in database
		var count = await Floor.getCount();

		if (count === 0) {
			for (var i = 0; i < floorFiller.length; i++) {
				const floor = new Floor();
				floor.id = i === 0 ? '0' : i;
				floor.name_english = floorFiller[i]['name_english'];
				floor.name_french = floorFiller[i]['name_french'];
				floor.building_id = floorFiller[i]['building_id'];
				await floor.save();
			}
			console.log('Floor Name DB: Finished Seeding');
		} else {
			console.log('Floor Name DB: Already Seeded');
		}
	}
}

module.exports = FloorSeeder;
