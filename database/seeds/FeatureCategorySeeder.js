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
			{ name_english: 'Projector', name_french: 'fProjector', feature_category_id: 1, building_id: 1 },
			{ name_english: 'Whiteboard', name_french: 'fWhiteboard', feature_category_id: 3, building_id: 1 },
			{ name_english: 'Flip Chart', name_french: 'fFlip Chart', feature_category_id: 3, building_id: 1 },
			{ name_english: 'Audio Conferencing', name_french: 'fAudio Conferencing', feature_category_id: 2, building_id: 1 },
			{ name_english: 'Video Conferencing', name_french: 'fVideo Conferencing', feature_category_id: 2, building_id: 1 },
			{ name_english: 'Surface Hub', name_french: 'fSurface Hub', feature_category_id: 1, building_id: 1 },
			{ name_english: 'PC', name_french: 'PC', feature_category_id: 1, building_id: 1 },
			{ name_english: 'Plasma TV', name_french: 'fPlasma TV', feature_category_id: 1, building_id: 1 },
			{ name_english: 'LCD TV', name_french: 'fLCD TV', feature_category_id: 1, building_id: 1 },
			{ name_english: 'SMART Board', name_french: 'fSMART Board', feature_category_id: 1, building_id: 1 },
			{ name_english: 'Glassboard', name_french: 'fGlassboard', feature_category_id: 3, building_id: 1 },
			{ name_english: 'Wifi', name_french: 'fWifi', feature_category_id: 4, building_id: 1 }
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
	}
}

module.exports = FeaturesCategorySeeder;
