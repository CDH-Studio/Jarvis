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
const RoomFeaturesCategory = use('App/Models/RoomFeaturesCategory');

class FeaturesCategorySeeder {
	async run () {
		var categoryFiller = ['Display Tools', 'Communication Tools', 'Discussion Tools', 'Connectivity', 'Other'];
		var count = await RoomFeaturesCategory.getCount();

		if (count === 0) {
			for (var i = 0; i < categoryFiller.length; i++) {
				const category = new RoomFeaturesCategory();
				category.name = categoryFiller[i];
				await category.save();
			}
			console.log('Category DB: Finished Seeding');
		} else {
			console.log('Category DB: Already Seeded');
		}
	}
}

module.exports = FeaturesCategorySeeder;
