'use strict';
const Building = use('App/Models/Building');
const Tower = use('App/Models/Tower');
const Feature = use('App/Models/RoomFeature');
const RoomFeaturesCategory = use('App/Models/RoomFeaturesCategory');

class TowerController {


	async addTower ({ request, response, session }) {
		try {

			const selectedBuilding = request.cookie('selectedBuilding');

			const building = await Building.query().where('name', selectedBuilding).firstOrFail();

			// Retrieves user input
			const body = request.all();
			// Populates the review object's values
			const newTower = new Tower();
			newTower.name = body.towerName;
			newTower.building_id = building.id;
			await newTower.save();

			session.flash({ notification: 'Tower Added!' });

			return response.route('configuration');
		} catch (err) {
			console.log(err);
		}
	}

	async updateTower ({ params, response, request, session}) {
		try {

			const body = request.all();

			const tower = await Tower.find(params.id);

			tower.name = body.towerName;
			await tower.save();
			session.flash({ notification: 'Tower Updated!' });
			return response.route('configuration');

		} catch (err) {
			console.log(err);
		}
	}

	async deleteTower ({ params, response, request, session}) {
		try {

			const tower = await Tower.find(params.id);
			await tower.delete();
			
			session.flash({ notification: 'Tower Deleted!' });
			return response.route('configuration');

		} catch (err) {
			console.log(err);
		}
	}

	
}

module.exports = TowerController;
