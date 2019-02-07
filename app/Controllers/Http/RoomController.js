'use strict'
const Room = use('App/Models/Room');

class RoomController {
	async addRoom({ request, response, session }) {
		try {
			const body = request.post();
			const room = new Room();
			room.name = body.name;
			room.num = body.num;
			await room.save();

			session.flash({ notification: 'Room Added!' });
			return response.redirect('/addRoom');
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = RoomController
