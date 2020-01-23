'use strict';

/*
|--------------------------------------------------------------------------
| RoomFeaturesPivotSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const RoomFeature = use('App/Models/RoomFeature');
const FeaturesRoomsPivot = use('App/Models/FeaturesRoomsPivot');

class RoomFeaturesPivotSeeder {
	async run () {

		// load in dummy data for room features
		let roomFeaturePivotFillers = require('../seederData/room_features_pivot.json');

		// count room features in database
		const count = await FeaturesRoomsPivot.getCount();

		if (count == 0) {
			for (let i = 0; i < roomFeaturePivotFillers.length; i++) {
				const featuresRoomsPivot = new FeaturesRoomsPivot();
				featuresRoomsPivot.room_id = roomFeaturePivotFillers[i]['room_id'];
				featuresRoomsPivot.room_feature_id = roomFeaturePivotFillers[i]['room_feature_id'];
				await featuresRoomsPivot.save();
			}
			console.log('Room Features Pivot DB: Finished Seeding');
		} else {
			console.log('Room Features Pivot DB: Already Seeded');
		}
	}
}

module.exports = RoomFeaturesPivotSeeder;
