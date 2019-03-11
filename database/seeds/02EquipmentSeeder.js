'use strict';

/*
|--------------------------------------------------------------------------
| EquipmentSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Equipment = use('App/Models/Equipment');
const Logger = use('Logger');

// ForEach function for async callbacks
async function asyncForEach (arr, callback) {
	for (let i = 0; i < arr.length; i++) {
		await callback(arr[i], i, arr);
	}
}

class EquipmentSeeder {
	async run () {
		const equipments = ['Projector', 'Whiteboard', 'Flip Chart', 'Audio Conf.', 'Video Conf.', 'Surface Hub', 'PC', 'Plasma', 'Smartboard', 'LCD Smart TV', 'Writeable Wall'];
		const populateEquipments = async () => {
			await asyncForEach(equipments, async (item) => {
				const equipment = { name: item };
				await Equipment.create(equipment);
			});
		};

		await populateEquipments();
		Logger.info('Equipment DB: Finished Seeding');
	}
}

module.exports = EquipmentSeeder;
