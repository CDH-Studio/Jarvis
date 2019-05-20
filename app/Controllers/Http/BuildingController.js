'use strict';
const Building = use('App/Models/Building');

class BuildingController {


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


	
}

module.exports = BuildingController;
