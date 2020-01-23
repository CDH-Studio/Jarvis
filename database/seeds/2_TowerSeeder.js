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
		// load in dummy data for buildings
		let towerFiller = require('../seederData/towers.json');

		// count buildings in database
		const count = parseInt(await Tower.getCount());
		console.log(count)

		if (count === 0) {
			for (var i = 0; i < towerFiller.length; i++) {
				const tower = new Tower();
				tower.name_english = towerFiller[i]['name_english'];
				tower.name_french = towerFiller[i]['name_french'];
				tower.building_id = towerFiller[i]['building_id'];
				await tower.save();
			}
			console.log('Tower Name DB: Finished Seeding');
		} else {
			console.log('Tower Name DB: Already Seeded');
		}
	}
}

module.exports = TowerSeeder;
