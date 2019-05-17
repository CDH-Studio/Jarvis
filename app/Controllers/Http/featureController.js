'use strict';
const Floor = use('App/Models/Floor');
const Tower = use('App/Models/Tower');
const Feature = use('App/Models/RoomFeature');
const Room = use('App/Models/Room');
const User = use('App/Models/User');
const Report = use('App/Models/Report');
const ReportStatus = use('App/Models/ReportStatus');
const ReportType = use('App/Models/ReportType');
const RoomFeaturesCategory = use('App/Models/RoomFeaturesCategory');

class IssueController {

	/**
	 * Reports a room
	 *
	 * @param {Object} Context The context object.
	 */
	async show ({ view }) {
		const buildingFloors = await Floor.all();
		const buildingTowers = await Tower.all();
		const categories = await RoomFeaturesCategory.query().with('features').fetch();
		const roomFeatures = await Feature.query().with('category').fetch();


		return view.render('adminPages.viewConfiguration', 
								{ towers: buildingTowers.toJSON(),
			 					floors:buildingFloors.toJSON(),
			 					features:roomFeatures.toJSON(),
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
			await newFeature.save();

			session.flash({ notification: 'Feature Added!' });

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

module.exports = IssueController;
