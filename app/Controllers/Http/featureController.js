'use strict';
const Building = use('App/Models/Building');
const Feature = use('App/Models/RoomFeature');
const RoomFeaturesCategory = use('App/Models/RoomFeaturesCategory');

class FeatureController {


	/**
	 * Reports a room
	 *
	 * @param {Object} Context The context object.
	 */
	async show ({ request, view }) {
		const allBuildings = await Building.all();

		const selectedBuilding = request.cookie('selectedBuilding')

		const building = await Building.query()
								.where('id', selectedBuilding.id)
								.with('floor')
								.with('tower')
								.with('floor.room')
								.with('tower.room')
								.firstOrFail();
		
		const categories = await RoomFeaturesCategory
									.query()
									.with('features', (builder) => {
										 builder.where('building_id', 1)
									}).fetch();


		return view.render('adminPages.viewConfiguration', 
								{allBuildings: allBuildings.toJSON(),
								building: building.toJSON(),
			 					categories: categories.toJSON() });

	}

	async addRoomFeature ({ request, response, session }) {
		try {

			// Retrieves user input
			const body = request.all();
			// Populates the review object's values
			const newFeature = new Feature();
			newFeature.name = body.featureName;
			newFeature.feature_category_id = body.featureCategory;
			newFeature.building_id = 1;
			await newFeature.save();

			session.flash({ notification: 'Feature Added!' });

			return response.route('configuration');
		} catch (err) {
			console.log(err);
		}
	}

	async updateRoomFeature ({ params, response, request, session}) {
		try {
			const body = request.all();
			// Updates room information in database
			const feature = await Feature
				.query()
				.where('id', params.id)
				.firstOrFail();

			feature.name = body.featureName;
			await feature.save();
			session.flash({ notification: 'Feature Updated!' });
			return response.route('configuration');
		} catch (err) {
			console.log(err);
		}
	}


	async deleteRoomFeature ({ params, response}) {
		try {
			const { id } = params;
			const feature = await Feature.find(params.id)

			await feature.delete()
			return response.route('configuration');

		} catch (err) {
			console.log(err);
		}
	}

	
}

module.exports = FeatureController;
