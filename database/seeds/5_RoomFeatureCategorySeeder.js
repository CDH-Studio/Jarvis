'use strict';

/*
|--------------------------------------------------------------------------
| RoomFeatureCategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const RoomFeaturesCategory = use('App/Models/RoomFeaturesCategory');

class RoomFeatureCategorySeeder {
	async run () {
		// load in dummy data for categories
		let categoriesFiller = require('../seederData/room_features_categories.json');

		// count categories in database
		const count = await RoomFeaturesCategory.getCount();

		if (count == 0) {
			for (var i = 0; i < categoriesFiller.length; i++) {
				const category = new RoomFeaturesCategory();
				category.name_english = categoriesFiller[i]['name_english'];
				category.name_french = categoriesFiller[i]['name_french'];
				category.icon = categoriesFiller[i]['icon'];
				await category.save();
			}
			console.log('Category DB: Finished Seeding');
		} else {
			console.log('Category DB: Already Seeded');
		}
	}
}

module.exports = RoomFeatureCategorySeeder;
