'use strict';

/*
|--------------------------------------------------------------------------
| RoomEquipmentSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Room = use('App/Models/Room');
const Equipment = use('App/Models/Equipment');
const Logger = use('Logger');

// ForEach function for async callbacks
async function asyncForEach (arr, callback) {
	for (let i = 0; i < arr.length; i++) {
		await callback(arr[i], i, arr);
	}
}

class RoomEquipmentSeeder {
	async dependencies () {
		return ['RoomSeeder'];
	}

	async run () {
		const equipments = {
			'Projector': [1, 8, 18, 20, 21, 24, 25, 26, 27, 30, 33, 34, 44],
			'Whiteboard': [1, 8, 9, 10, 11, 12, 14, 17, 19, 20, 21, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 38, 39, 41, 42, 43, 44], // 42
			'Flip Chart': [12, 22, 24, 26, 27, 31, 32, 33, 34, 36, 37, 39, 41, 42, 43, 44], // 58
			'Audio Conf.': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33, // 89
				34, 35, 37, 38, 39, 40, 41, 42, 43, 44], // 99
			'Video Conf.': [1, 9, 15, 18, 19, 28, 31, 44], // 107
			'Surface Hub': [4, 5, 6, 7, 10, 11, 22, 24, 25, 26, 27, 29, 30, 33, 35, 37, 38, 39, 42, 43], // 127
			'PC': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, // 160
				34, 35, 37, 38, 39, 40, 41, 42, 43, 44], // 170
			'Plasma': [2, 3, 12, 13, 14, 17, 27], // 177
			'Smartboard': [8, 20, 21, 23, 28, 31, 32, 40],
			'LCD Smart TV': [15],
			'Writeable Wall': [12]
		};

		const populateRoomEquipment = async (roomIds, name) => {
			await asyncForEach(roomIds, async (roomId) => {
				const room = await Room.findBy('id', roomId);
				const equipment = await Equipment.findBy('name', name);
				await room.equipments().save(equipment);
				await equipment.rooms().save(room);
			});
		};

		for (let name in equipments) {
			const roomIds = equipments[name];
			await populateRoomEquipment(roomIds, name);
		}

		Logger.info('RoomEquipment DB: Finished Seeding');

		// const room = await Room.findBy('id', 1);
		// const equips = (await room.equipments().fetch()).toJSON();
		// console.log(equips);
		// await room.equipments().delete();
		// const equip = await Equipment.findBy('id', 7);
		// await equip.delete();
	}
}

module.exports = RoomEquipmentSeeder;
