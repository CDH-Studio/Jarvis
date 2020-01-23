'use strict';

/*
|--------------------------------------------------------------------------
| RoomFeatureSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const RoomFeature = use('App/Models/RoomFeature');

class RoomFeatureSeeder {
	async run () {

		// load in dummy data for room features
		let featuresFiller = require('../seederData/room_features.json');

		// count room features in database
		const count = parseInt(await RoomFeature.getCount());

		if (count == 0) {
			for (let i = 0; i < featuresFiller.length; i++) {
				const feature = new RoomFeature();
				feature.name_english = featuresFiller[i]['name_english'];
				feature.name_french = featuresFiller[i]['name_french'];
				feature.feature_category_id = featuresFiller[i]['feature_category_id'];
				feature.building_id = featuresFiller[i]['building_id'];
				await feature.save();
			}
			console.log('Room Features DB: Finished Seeding');
		} else {
			console.log('Room Features DB: Already Seeded');
		}
	}
}

module.exports = RoomFeatureSeeder;
