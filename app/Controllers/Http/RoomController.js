'use strict';
const Room = use('App/Models/Room');
const Helpers = use('Helpers');

class RoomController {
	// Adds a room Object into the Database
	async addRoom ({ request, response, session, params, view }) {
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

			// Upload process - Room Picture
			const roomImage = request.file('roomPicture', {
				types: ['image'],
				size: '2mb'
			});
			await roomImage.move(Helpers.publicPath('uploads/roomPictures/'), {
				// Name must follow specific guidlines - CANNOT HAVE THE SAME NAME
				name: `${room.name}_roomPicture.png`
			});

			room.floorplan = `uploads/floorPlans/${room.name}.png`;
			room.picture = `uploads/roomPictures/${room.name}.png`;
			room.extraEquipment = body.extraEquipment;
			room.comment = body.comment;

			await room.save();

			session.flash({ notification: 'Room Added!' });
			// return response.redirect('/roomDetails');
			return view.render('adminDash.roomDetails', { params, room });
		} catch (err) {
			console.log(err);
		}
	}

	async edit ({ params, view }) {
		// Retrieves room object
		const room = await Room.findBy('id', params.id);

		return view.render('adminDash.editRoom', { room: room });
	}

	async update ({ request, response, session, params, view }) {
		// Retrieves room object
		let room = await Room.findBy('id', params.id);

		// Retrieves user input
		const body = request.all();

		// Upload process - Floor Plan
		const floorPlanImage = request.file('floorPlan', {
			types: ['image'],
			size: '2mb'
		});
		await floorPlanImage.move(Helpers.publicPath('uploads/floorPlans/'), {
			// Name must follow specific guidlines - CANNOT HAVE THE SAME NAME
			name: `${body.name}_floorPlan.png`
		});

		// Upload process - Room Picture
		const roomImage = request.file('roomPicture', {
			types: ['image'],
			size: '2mb'
		});
		await roomImage.move(Helpers.publicPath('uploads/roomPictures/'), {
			// Name must follow specific guidlines - CANNOT HAVE THE SAME NAME
			name: `${body.name}_roomPicture.png`
		});

		// Updates room information in database
		await Room
			.query()
			.where('name', room.name)
			.update({
				name: body.name,
				location: body.location,
				telephone: body.seats,
				seats: body.tableSeats,
				capacity: body.maximumCapacity,
				projector: body.projectorCheck,
				whiteboard: body.whiteboardCheck,
				flipchart: body.flipchart,
				audioConference: body.audioCheck,
				videoConference: body.videoCheck,
				floorplan: `uploads/floorPlans/${body.name}.png`,
				picture: `uploads/roomPictures/${body.name}.png`,
				extraEquipment: body.extraEquipment,
				comment: body.comment
			});

		room = await Room.findBy('name', body.name);

		session.flash({ notification: 'Room Updated!' });

		return view.render('adminDash.roomDetails', { params, room });
	}

	async show ({ response, params, view }) {
		// Retrieves room object
		try {
			const room = await Room.firstOrFail('id', params.id);
			return view.render('adminDash.roomDetails', { room: room });
		} catch (error) {
			return response.redirect('/');
		}
	}
}

module.exports = RoomController;
