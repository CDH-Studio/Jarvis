'use strict';
const Building = use('App/Models/Building');
const Tower = use('App/Models/Tower');
const Room = use('App/Models/Room');

class TowerController {

	async addTower ({ request, response, session }) {
		try {
			const selectedBuilding = request.cookie('selectedBuilding');

			const building = await Building.findByOrFail('name', selectedBuilding.name);

			// Retrieves user input
			const body = request.all();
			// Populates the review object's values
			const newTower = new Tower();
			newTower.name_english = body.towerNameEnglish;
			newTower.name_french = body.towerNameFrench;
			newTower.building_id = building.id;
			await newTower.save();

			session.flash({ notification: 'Tower Added!' });

			return response.route('configuration');
		} catch (err) {
			session.flash({error: 'Something when wrong. Tower Not Added.' });
			console.log(err);
			response.redirect('back');
		}
	}

	async updateTower ({ params, response, request, session }) {
		try {
			const body = request.all();
			const tower = await Tower.find(params.id);
			tower.name_english = body.towerNameEnglish;
			tower.name_french = body.towerNameFrench;
			await tower.save();
			session.flash({ notification: 'Tower Updated!' });
			return response.route('configuration');

		} catch (err) {
			session.flash({error: 'Something when wrong. Tower Not Updated.' });
			console.log(err);
			response.redirect('back');
		}
	}

	async deleteTower ({ params, response, request, session }) {
		try {
			const roomCount = await Room.query().where('tower_id', params.id).getCount();

			if (roomCount === 0) {
				const tower = await Tower.find(params.id);
				await tower.delete();

				session.flash({ notification: 'Tower Deleted!' });
			}

			return response.route('configuration');
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = TowerController;
