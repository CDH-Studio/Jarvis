'use strict';
const Building = use('App/Models/Building');
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
	async setBuilding ({ response, params, view }) {

		try{
			const building = await Building.query()
								.where('id', params.id)
								.firstOrFail();

			response.cookie('selectedBuilding', building.name, { path: '/' })
		}catch(err){
			console.log(err);
		}

		return response.route('home');

	}


	/**
	 * Reports a room
	 *
	 * @param {Object} Context The context object.
	 */
	async viewSelectBuilding ({ request, view }) {

		//get all building
		const Building = use('App/Models/Building');
		const allBuildings = await Building.all();

		return view.render('adminPages.selectBuilding', {allBuildings: allBuildings.toJSON()});

	}

	/**
	 * Reports a room
	 *
	 * @param {Object} Context The context object.
	 */
	async show ({ request, view }) {
		const allBuildings = await Building.all();

		const selectedBuilding = request.cookie('selectedBuilding')

		const building = await Building.query()
								.where('name', selectedBuilding)
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
