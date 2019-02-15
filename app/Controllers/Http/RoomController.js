'use strict'
const Room = use('App/Models/Room');
const Helpers = use('Helpers');
const graph = require('@microsoft/microsoft-graph-client');
const room_id = 'AQMkADAwATM3ZmYAZS1kNzk2LWRkADNkLTAwAi0wMAoARgAAA5AqfjNGCEVAv9Maot2ubu8HAIvwfWDIkbVCrIYUZM1RmYwAAAIBBgAAAIvwfWDIkbVCrIYUZM1RmYwAAlWD4rsAAAA=';

class RoomController {
	// Adds a room Object into the Database
	async addRoom({ request, response, session, view }) {
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

			await room.save();

			session.flash({ notification: 'Room Added!' });
			//return response.redirect('/addRoom');
			//return response.redirect('/roomDetails');
			return view.render('adminDash.roomDetails', { room });
		} catch (err) {
			console.log(err);
		}
	}

	async getAllRooms({ view }) {
		const results = await Room.all();
		const rooms = results.toJSON();

		rooms.sort((a,b) => {
			return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
		});
		console.log(rooms)

		return view.render('userPages.results', { rooms });
	}

	async confirmBooking({ request, response }) {
		const {title, date, from, to, location} = request.only(['title', 'date', 'from', 'to', 'location'])
		const event = {
			'subject': title,
			'body': {
				'contentType': 'HTML',
				'content': 'Does late morning work for you?'
			},
			'start': {
				'dateTime': `${date}T${from}`,
				'timeZone': 'Eastern Standard Time'
			},
			'end': {
				'dateTime': `${date}T${to}`,
				'timeZone': 'Eastern Standard Time'
			},
			'location':{
				'displayName':'311A (E)'
			},
			'attendees': [
				{
				'emailAddress': {
					'address':'liyunwei10@gmail.com',
					'name': 'Li'
				},
				'type': 'required'
				}
			]
		  }

		  const createdEvent = this.createEvent(request, event);

		  if (createdEvent)
		  	return response.redirect('/booking');
	}

	async getEvents({ request }) {
		const accessToken = request.cookie('accessToken');
		const username = request.cookie('username');

		if (username && accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const events = await client
      				.api('/me/events')
      				.select('subject,organizer,start,end')
      				//.orderby('createdDateTime DESC')
      				.get();
				
				return events;
			  } catch (err) {
				console.log(err);
			  }
		}
	}

	async getCalendars({ request }) {
		const accessToken = request.cookie('accessToken');
		const username = request.cookie('username');

		if (username && accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const calendars = await client
      				.api('/me/calendars')
      				//.orderby('createdDateTime DESC')
      				.get();
				
				return calendars;
			  } catch (err) {
				console.log(err);
				return;
			  }
		}
	}

	async getCalendar({ request }) {
		const accessToken = request.cookie('accessToken');
		const username = request.cookie('username');

		if (username && accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const calendars = await client
      				.api(`/me/calendars/${room_id}`)
      				//.orderby('createdDateTime DESC')
      				.get();
				
				return calendars;
			  } catch (err) {
				console.log(err);
			  }
		}
	}

	async createEvent(request, event) {
		const accessToken = request.cookie('accessToken');
		const username = request.cookie('username');

		if (username && accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const newEvent = await client
		  			.api(`/me/calendars/${room_id}/events`)
		  			.post(event);
				
				return newEvent;
			  } catch (err) {
				console.log(err);
			  }
		}
	}
}

module.exports = RoomController
