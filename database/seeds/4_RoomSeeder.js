'use strict';

/*
|--------------------------------------------------------------------------
| RoomSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Room = use('App/Models/Room');

class RoomSeeder {
	async run () {
		// load in dummy data for rooms
		let roomFiller = require('../seederData/rooms.json');

		// count rooms in database
		var count = await Room.getCount();

		if (count == 0) {
			for (var i = 0; i < roomFiller.length; i++) {
				const room = new Room();
				room.name = roomFiller[i]['name'];
				room.fullName = roomFiller[i]['fullName'];
				room.building_id = roomFiller[i]['building_id'];
				room.tower_id = roomFiller[i]['tower_id'];
				room.floor_id = roomFiller[i]['floor_id'];
				room.telephone = roomFiller[i]['telephone'];
				room.capacity = roomFiller[i]['capacity'];
				room.seats = roomFiller[i]['seats'];
				room.avg_rating = roomFiller[i]['avg_rating'];
				room.extraEquipment = roomFiller[i]['extraEquipment'];
				room.comment = roomFiller[i]['comment'];
				room.picture = roomFiller[i]['picture'];
				room.picture_small = roomFiller[i]['picture_small'];
				room.floorplan = roomFiller[i]['floorplan'];
				room.floorplan_small = roomFiller[i]['floorplan_small'];
				room.calendar = roomFiller[i]['calendar'];
				room.state_id = roomFiller[i]['state_id'];
				await room.save();
			}
			console.log('Rooms DB: Finished Seeding');
		} else {
			console.log('Floors DB: Already Seeded');
		}
	}
}

module.exports = RoomSeeder;
