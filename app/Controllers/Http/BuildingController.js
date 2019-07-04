'use strict';
const Building = use('App/Models/Building');
const RoomFeaturesCategory = use('App/Models/RoomFeaturesCategory');

class BuildingController {
	/**
	 * show building configuration such as:
	 * floors, towers, features
	 *
	 * @param {Object} Context The context object.
	 */
	async show ({ request, view }) {
		const allBuildings = await Building.all();

		const selectedBuilding = request.cookie('selectedBuilding');

		const building = await Building.query()
			.where('id', selectedBuilding.id)
			.with('floor')
			.with('tower')
			.with('floor.room')
			.with('tower.room')
			.firstOrFail();

		const categories = await RoomFeaturesCategory
			.query()
			.with('features.room', (builder) => {
				builder.where('building_id', 1);
			}).fetch();

		return view.render('adminPages.viewBuildingConfig',
			{ allBuildings: allBuildings.toJSON(),
				building: building.toJSON(),
				categories: categories.toJSON()
			});
	}

	/**
	 * view all building to manage
	 *
	 * @param {Object} Context The context object.
	 */
	async viewSelectBuilding ({ request, view }) {
		// get all building
		const Building = use('App/Models/Building');
		const allBuildings = await Building.all();

		return view.render('adminPages.selectBuilding', { allBuildings: allBuildings.toJSON() });
	}

	/**
	 * store the selected building in the cookie
	 *
	 * @param {Object} Context The context object.
	 */
	async setBuilding ({ response, params, view }) {
		try {
			const building = await Building.query()
				.where('id', params.id)
				.firstOrFail();

			response.cookie('selectedBuilding', building.toJSON(), { path: '/' });
		} catch (err) {
			console.log(err);
		}

		return response.route('home');
	}
}

module.exports = BuildingController;
