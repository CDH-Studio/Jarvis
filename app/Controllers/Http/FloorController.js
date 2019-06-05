'use strict';
const Building = use('App/Models/Building');
const Floor = use('App/Models/Floor');
const Room = use('App/Models/Room');

class FloorController {

	async addFloor ({ request, response, session }) {
		try {
			const selectedBuilding = request.cookie('selectedBuilding');

			const building = await Building.findByOrFail('name', selectedBuilding.name);

			// Retrieves user input
			const body = request.all();
			// Populates the review object's values
			const newFloor = new Floor();
			newFloor.name_english = body.floorNameEnglish;
			newFloor.name_french = body.floorNameFrench;
			newFloor.building_id = building.id;
			await newFloor.save();

			session.flash({ notification: 'Floor Added!' });

			return response.route('configuration');
		} catch (err) {
			session.flash({error: 'Something when wrong. Floor Not Added.' });
			console.log(err);
			response.redirect('back');
		}
	}

	async updateFloor ({ params, response, request, session }) {
		try {
			const body = request.all();
			// Updates room information in database
			const floor = await Floor.find(params.id);

			floor.name_english = body.floorNameEnglish;
			floor.name_french = body.floorNameFrench;
			await floor.save();
			session.flash({ notification: 'Floor Updated!' });
			return response.route('configuration');
		} catch (err) {
			session.flash({error: 'Something when wrong. Floor Not Updated.' });
			console.log(err);
			response.redirect('back');
		}
	}

	async deleteFloor ({ params, response, request, session }) {
		try {
			const roomCount = await Room.query().where('floor_id', params.id).getCount();

			if (roomCount === 0) {
				const floor = await Floor.find(params.id);
				await floor.delete();

				session.flash({ notification: 'Floor Deleted!' });
			}

			return response.route('configuration');
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = FloorController;
