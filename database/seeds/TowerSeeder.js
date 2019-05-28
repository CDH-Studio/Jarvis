'use strict';

/*
|--------------------------------------------------------------------------
| TowerSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Tower = use('App/Models/Tower');

class TowerSeeder {
	async run () {
		var towerFiller = ['East', 'West'];
		var buildingFiller = [1, 1];
		var count = await Tower.getCount();

		if (count === 0) {
			for (var i = 0; i < towerFiller.length; i++) {
				const tower = new Tower();
				tower.name = towerFiller[i];
				tower.building_id = buildingFiller[i];
				await tower.save();
			}
			console.log('Tower Name DB: Finished Seeding');
		} else {
			console.log('Tower Name DB: Already Seeded');
		}
	}
}

module.exports = TowerSeeder;
