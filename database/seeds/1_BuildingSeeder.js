'use strict';

/*
|--------------------------------------------------------------------------
| BuildingSeeder
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
		// load in dummy data for buildings
		let buildingFiller = require('../seederData/buildings.json');

		// count buildings in database
		var count = await Building.getCount();

		if (count === 0) {
			for (var i = 0; i < buildingFiller.length; i++) {
				const building = new Building();
				building.name = buildingFiller[i]['name'];
				building.street_address = buildingFiller[i]['street_address'];
				building.postal_code = buildingFiller[i]['postal_code'];
				building.city = buildingFiller[i]['city'];
				building.country = buildingFiller[i]['country'];
				await building.save();
			}
			console.log('Building DB: Finished Seeding');
		} else {
			console.log('Building DB: Already Seeded');
		}
	}
}

module.exports = FloorSeeder;
