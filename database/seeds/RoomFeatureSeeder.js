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

		// load in dummy data for room features
		let featuresFiller = require('../seederData/room_features.json');

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

		count = await FeaturesRoomsPivot.getCount();
		if (count == 0) {
			const roomFeaturePivotFillers = {};
			roomFeaturePivotFillers['1'] = [1, 2, 4, 5, 7];
			roomFeaturePivotFillers['2'] = [4, 7];
			roomFeaturePivotFillers['3'] = [4, 7];
			roomFeaturePivotFillers['4'] = [4, 6, 7];
			roomFeaturePivotFillers['5'] = [4, 6, 7];
			roomFeaturePivotFillers['6'] = [4, 6, 7];
			roomFeaturePivotFillers['7'] = [4, 6, 7];
			roomFeaturePivotFillers['8'] = [2, 4, 5, 7];
			roomFeaturePivotFillers['9'] = [2, 4, 6, 7];
			roomFeaturePivotFillers['10'] = [2, 4, 6, 7];
			roomFeaturePivotFillers['11'] = [7];
			roomFeaturePivotFillers['12'] = [2, 4, 7];
			roomFeaturePivotFillers['13'] = [4, 5, 7];
			roomFeaturePivotFillers['14'] = [2, 4, 7];
			roomFeaturePivotFillers['15'] = [1, 4, 5, 7];
			roomFeaturePivotFillers['16'] = [2, 4, 5, 7];
			roomFeaturePivotFillers['17'] = [1, 2, 4, 7];
			roomFeaturePivotFillers['18'] = [1, 2, 4, 7];
			roomFeaturePivotFillers['19'] = [3, 4, 6, 7];
			roomFeaturePivotFillers['20'] = [2, 4, 7];
			roomFeaturePivotFillers['21'] = [1, 2, 3, 4, 6, 7];
			roomFeaturePivotFillers['22'] = [1, 4, 6, 7];
			roomFeaturePivotFillers['23'] = [1, 2, 3, 4, 6, 7];
			roomFeaturePivotFillers['24'] = [2, 3, 4, 7];
			roomFeaturePivotFillers['25'] = [2, 4, 5, 7];
			roomFeaturePivotFillers['26'] = [2, 4, 6, 7];
			roomFeaturePivotFillers['27'] = [1, 2, 4, 6, 7];
			roomFeaturePivotFillers['28'] = [2, 3, 4, 5, 7];
			roomFeaturePivotFillers['29'] = [2, 3, 4, 7];
			roomFeaturePivotFillers['30'] = [1, 2, 3, 4, 6, 7];
			roomFeaturePivotFillers['31'] = [1, 2, 3, 4, 7];
			roomFeaturePivotFillers['32'] = [2, 4, 6, 7];
			roomFeaturePivotFillers['33'] = [3];
			roomFeaturePivotFillers['34'] = [3, 4, 6, 7];
			roomFeaturePivotFillers['35'] = [2, 4, 6, 7];
			roomFeaturePivotFillers['36'] = [2, 3, 4, 6, 7];
			roomFeaturePivotFillers['37'] = [4, 7];
			roomFeaturePivotFillers['38'] = [2, 3, 4, 7];
			roomFeaturePivotFillers['39'] = [2, 3, 4, 6, 7];
			roomFeaturePivotFillers['40'] = [2, 3, 4, 6, 7];
			roomFeaturePivotFillers['41'] = [1, 2, 3, 4, 5, 7];

			const rooms = Object.keys(roomFeaturePivotFillers);
			const loopThroughRooms = async () => {
				const loopThroughFeatures = async (room, feats) => {
					await asyncForEach(feats, async (feat) => {
						const featuresRoomsPivot = new FeaturesRoomsPivot();
						featuresRoomsPivot.room_id = room;
						featuresRoomsPivot.room_feature_id = feat;
						await featuresRoomsPivot.save();
					});
				};

				await asyncForEach(rooms, async (room) => {
					await loopThroughFeatures(room, roomFeaturePivotFillers[room]);
				});
			};
			await loopThroughRooms();
			console.log('Room Features Pivot DB: Finished Seeding');
		} else {
			console.log('Room Features Pivot DB: Already Seeded');
		}
	}
}

module.exports = RoomFeatureSeeder;
