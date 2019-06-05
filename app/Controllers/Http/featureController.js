'use strict';
const Building = use('App/Models/Building');
const Feature = use('App/Models/RoomFeature');
const RoomFeaturesCategory = use('App/Models/RoomFeaturesCategory');

class FeatureController {

	//save new room feature based on feature category
	async addRoomFeature ({ request, response, session }) {
		try {

			// Retrieves user input
			const body = request.all();

			// check if feature category exists
			await RoomFeaturesCategory.findOrFail(body.featureCategory);

			// Populates the review object's values
			const newFeature = new Feature();
			newFeature.name_english = body.featureNameEnglish;
			newFeature.name_french = body.featureNameFrench;
			newFeature.feature_category_id = body.featureCategory;
			newFeature.building_id = 1;
			await newFeature.save();

			session.flash({ notification: 'Feature Added!' });

			return response.route('configuration');
		} catch (err) {
			session.flash({error: 'Something when wrong. Feature Not Added.' });
			console.log(err);
			response.redirect('back');
		}
	}

	async updateRoomFeature ({ params, response, request, session }) {
		try {
			const body = request.all();
			// Updates room information in database
			const feature = await Feature
				.query()
				.where('id', params.id)
				.firstOrFail();

			feature.name_english = body.featureNameEnglish;
			feature.name_french = body.featureNameFrench;
			await feature.save();
			session.flash({ notification: 'Feature Updated!' });
			return response.route('configuration');

		} catch (err) {
			session.flash({error: 'Something when wrong. Feature Not Updated.' });
			console.log(err);
			response.redirect('back');
		}
	}

	async deleteRoomFeature ({ params, response }) {
		try {
			const feature = await Feature.find(params.id);
			await feature.delete();
			return response.route('configuration');
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = FeatureController;
