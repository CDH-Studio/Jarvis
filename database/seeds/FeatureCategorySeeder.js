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

class FeaturesCategorySeeder {
	async run () {
		var categoryNameFillerEnglish = ['Display', 'Conferencing', 'Collaboration', 'Connectivity', 'Other'];
		var categoryNameFillerFrench = ['Outils D\'Affichage', 'Conférence', 'Collaboration', 'Connectivité', 'Autre'];
		var categoryIconFiller = ['fas fa-tv', 'fas fa-headset', 'fas fa-chalkboard-teacher', 'fas fa-wifi', 'fas fa-plus'];
		var count = await RoomFeaturesCategory.getCount();

		if (count === 0) {
			for (var i = 0; i < categoryNameFillerEnglish.length; i++) {
				const category = new RoomFeaturesCategory();
				category.name_english = categoryNameFillerEnglish[i];
				category.name_french = categoryNameFillerFrench[i];
				category.icon = categoryIconFiller[i];
				await category.save();
			}
			console.log('Category DB: Finished Seeding');
		} else {
			console.log('Category DB: Already Seeded');
		}

		const featureFillers = [
			{ name_english: 'Projector', name_french: 'Projecteur', feature_category_id: 1, building_id: 1 },
			{ name_english: 'Whiteboard', name_french: 'Tableau blanc', feature_category_id: 3, building_id: 1 },
			{ name_english: 'Flip Chart', name_french: 'Tableau à feuilles mobiles', feature_category_id: 3, building_id: 1 },
			{ name_english: 'Audio Conferencing', name_french: 'Conférence audio', feature_category_id: 2, building_id: 1 },
			{ name_english: 'Video Conferencing', name_french: 'Conférence vidéo', feature_category_id: 2, building_id: 1 },
			{ name_english: 'Surface Hub', name_french: 'Surface Hub', feature_category_id: 1, building_id: 1 },
			{ name_english: 'PC', name_french: 'PC', feature_category_id: 1, building_id: 1 },
			{ name_english: 'Plasma TV', name_french: 'Téléviseur Plasma', feature_category_id: 1, building_id: 1 },
			{ name_english: 'LCD TV', name_french: 'Téléviseur', feature_category_id: 1, building_id: 1 },
			{ name_english: 'SMART Board', name_french: 'Tableau intéractif', feature_category_id: 1, building_id: 1 },
			{ name_english: 'Glassboard', name_french: 'Tableau vitré', feature_category_id: 3, building_id: 1 },
			{ name_english: 'Wifi', name_french: 'Wifi', feature_category_id: 4, building_id: 1 }
		];

		count = await RoomFeature.getCount();

		if (count === 0) {
			for (let i = 0; i < featureFillers.length; i++) {
				const feature = new RoomFeature();
				feature.name_english = featureFillers[i].name_english;
				feature.name_french = featureFillers[i].name_french;
				feature.feature_category_id = featureFillers[i].feature_category_id;
				feature.building_id = featureFillers[i].building_id;
				await feature.save();
			}
			console.log('Room Features DB: Finished Seeding');
		} else {
			console.log('Room Features DB: Already Seeded');
		}

		count = await FeaturesRoomsPivot.getCount();
		if (count === 0) {
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

module.exports = FeaturesCategorySeeder;
