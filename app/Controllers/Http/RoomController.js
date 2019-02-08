'use strict'
const Room = use('App/Models/Room');
const Helpers = use('Helpers');

class RoomController {
	// Adds a room Object into the Database
	async addRoom({ request, response, session }) {
		try {
			// Retrieves user input
			const body = request.post();

			// Populates the room object's values 
			const room = new Room();
			room.name = body.name;
			room.location = body.location;
			room.telephone = body.telephoneNumber;
			room.seats = body.tableSeats;
			room.capacity = body.maximumCapacity;
			room.projector = body.projector;
			room.whiteboard = body.whiteboard;

			// Upload process - Floor Plan
			const floorPlanImage = request.file('floorPlan', {
				types: ['image'],
				size: '2mb'
			});

			await floorPlanImage.move(Helpers.publicPath('uploads/floorPlans/'), {
				// Name must follow specific guidlines - CANNOT HAVE THE SAME NAME 
				name: 'testFloorPlan.png',
			});

			if (!floorPlanImage.moved()) {
				return profilePic.error().message;
			}

			// Upload process - Room Picture
			const roomImage = request.file('roomPicture', {
				types: ['image'],
				size: '2mb'
			});

			await roomImage.move(Helpers.publicPath('uploads/roomPictures/'), {
				name: 'testRoomImage.png',
			});

			if (!roomImage.moved()) {
				return profilePic.error().message;
			}

			await room.save();

			session.flash({ notification: 'Room Added!' });
			return response.redirect('/addRoom');
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = RoomController
