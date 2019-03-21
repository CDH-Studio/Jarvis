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
		var FloorFiller = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
		var count = await Floor.getCount();

		if (count === 0) {
			for (var i = 0; i < FloorFiller.length; i++) {
				const floor = new Floor();
				floor.name = FloorFiller[i];
				await floor.save();
			}
			console.log('Floor Name DB: Finished Seeding');
		} else {
			console.log('Floor Name DB: Already Seeded');
		}
	}
}

module.exports = FloorSeeder;
