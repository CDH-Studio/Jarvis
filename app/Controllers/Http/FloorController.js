'use strict';
const Building = use('App/Models/Building');
const Floor = use('App/Models/Floor');
const Feature = use('App/Models/RoomFeature');
const RoomFeaturesCategory = use('App/Models/RoomFeaturesCategory');

class FloorController {



	async addFloor ({ request, response, session }) {
		try {

			const selectedBuilding = request.cookie('selectedBuilding');

			const building = await Building.query().where('name', selectedBuilding).firstOrFail();

			// Retrieves user input
			const body = request.all();
			// Populates the review object's values
			const newFloor = new Floor();
			newFloor.name = body.floorName;
			newFloor.building_id = building.id;
			await newFloor.save();

			session.flash({ notification: 'Floor Added!' });

			return response.route('configuration');
		} catch (err) {
			console.log(err);
		}
	}

	async updateFloor ({ params, response, request, session}) {
		try {
			const body = request.all();
			// Updates room information in database
			const floor = await Floor
				.query()
				.where('id', params.id)
				.firstOrFail();

			floor.name = body.floorName;
			await floor.save();
			session.flash({ notification: 'Feature Updated!' });
			return response.route('configuration');

		} catch (err) {
			console.log(err);
		}
	}

	
}

module.exports = FloorController;
