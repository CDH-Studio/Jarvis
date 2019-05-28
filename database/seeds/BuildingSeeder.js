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
const Building = use('App/Models/Building');

class FloorSeeder {
	async run () {
		var count = await Building.getCount();

		if (count === 0) {
			const building = new Building();
			building.name = 'CD Howe';
			building.street_address = '55 Golflinks dr.';
			building.postal_code = 'K2J4Y3';
			building.city = 'Ottawa';
			building.country = 'Canada';
			await building.save();

			console.log('Building DB: Finished Seeding');
		} else {
			console.log('Building DB: Already Seeded');
		}
	}
}

module.exports = FloorSeeder;
