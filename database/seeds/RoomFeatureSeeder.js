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
const RoomFeature = use('App/Models/RoomFeature');
const FeaturesRoomsPivot = use('App/Models/FeaturesRoomsPivot');
// const Room = use('App/Models/Room');

async function asyncForEach (arr, callback) {
	for (let i = 0; i < arr.length; i++) {
		await callback(arr[i], i, arr);
	}
}

class RoomFeatureSeeder {
	async run () {

		// **************************************
		// SEED FEATURE CATEGORIES
		// **************************************

		// load in dummy data for categories
		let categoriesFiller = require('../seederData/room_features_categories.json');

		// count categories in database
		var count = await RoomFeaturesCategory.getCount();

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

		// **************************************
		// SEED ROOM FEATURES
		// **************************************

		// load in dummy data for room features
		let featuresFiller = require('../seederData/room_features.json');

		// count room features in database
		count = await RoomFeature.getCount();

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

		// **************************************
		// SEED FEATURES TO ROOM PIVOT TABLE
		// **************************************

		// load in dummy data for room features
		let roomFeaturePivotFillers = require('../seederData/room_features_pivot.json');

		// count room features in database
		count = await FeaturesRoomsPivot.getCount();

		if (count == 0) {
			for (let i = 0; i < featuresFiller.length; i++) {
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

module.exports = RoomFeatureSeeder;
