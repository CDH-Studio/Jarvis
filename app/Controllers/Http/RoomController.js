'use strict';
const Room = use('App/Models/Room');
const Helpers = use('Helpers');

class RoomController {
	// Adds a room Object into the Database
	async addRoom({ request, response, session, params, view }) {
		try {
			// Retrieves user input
			const body = request.all();

			// Populates the room object's values
			const room = new Room();
			room.name = body.name;
			room.location = body.location;
			room.telephone = body.telephoneNumber;
			room.seats = body.tableSeats;
			room.capacity = body.maximumCapacity;
			room.projector = body.projectorCheck;
			room.whiteboard = body.whiteboardCheck;
			room.flipchart = body.flipChartCheck;
			room.audioConference = body.audioCheck;
			room.videoConference = body.videoCheck;

			// Upload process - Floor Plan
			const floorPlanImage = request.file('floorPlan', {
				types: ['image'],
				size: '2mb'
			});
			await floorPlanImage.move(Helpers.publicPath('uploads/floorPlans/'), {
				// Name must follow specific guidlines - CANNOT HAVE THE SAME NAME
				name: `${room.name}_floorPlan.png`
			});
			if (!floorPlanImage.moved()) {
				return profilePic.error().message; // eslint-disable-line 
			}

			// Upload process - Room Picture
			const roomImage = request.file('roomPicture', {
				types: ['image'],
				size: '2mb'
			});
			await roomImage.move(Helpers.publicPath('uploads/roomPictures/'), {
				// Name must follow specific guidlines - CANNOT HAVE THE SAME NAME
				name: `${room.name}_roomPicture.png`
			});
			if (!roomImage.moved()) {
				return profilePic.error().message; // eslint-disable-line 
			}

			room.floorplan = `uploads/floorPlans/${room.name}.png`;
			room.picture = `uploads/roomPictures/${room.name}.png`;
			room.extraEquipment = body.extraEquipment;
			room.comment = body.comment;

			await room.save();

			session.flash({ notification: 'Room Added!' });
			//return response.redirect('/addRoom');
			//return response.redirect('/roomDetails');
			return view.render('adminDash.roomDetails', { params, room });
		} catch (err) {
			console.log(err);
		}
	}

	async edit({ params, view }) {
		const room = await Room.find(params.id);

		console.log('Came through the edit method');

		return view.render('adminDash.editRoom', { room: room });
	}

	async update({ params, view }) {
		const room = await Rooms.find(params.id);

		room.name = body.name;
		room.location = body.location;
		room.telephone = body.telephoneNumber;
		room.seats = body.tableSeats;
		room.capacity = body.maximumCapacity;
		room.projector = body.projectorCheck;
		room.whiteboard = body.whiteboardCheck;
		room.flipchart = body.flipChartCheck;
		room.audioConference = body.audioCheck;
		room.videoConference = body.videoCheck;

		// Upload process - Floor Plan
		const floorPlanImage = request.file('floorPlan', {
			types: ['image'],
			size: '2mb'
		});
		await floorPlanImage.move(Helpers.publicPath('uploads/floorPlans/'), {
			// Name must follow specific guidlines - CANNOT HAVE THE SAME NAME 
			name: `${room.name}_floorPlan.png`,
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
			// Name must follow specific guidlines - CANNOT HAVE THE SAME NAME 
			name: `${room.name}_roomPicture.png`,
		});
		if (!roomImage.moved()) {
			return profilePic.error().message;
		}

		room.floorplan = `uploads/floorPlans/${room.name}.png`;
		room.picture = `uploads/roomPictures/${room.name}.png`;
		room.extraEquipment = body.extraEquipment;
		room.comment = body.comment;

		return response.redirect('/roomDetails');
	}
}

module.exports = RoomController;
