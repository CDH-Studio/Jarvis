'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RelationsSchema extends Schema {
	up () {
		this.create('room_equipment', (table) => {
			table.integer('room_id').notNullable();
			table.integer('equipment_id').notNullable();
			table.primary('room_id', 'equipment_id');
			table.foreign('equipment_id').references('id').on('equipments').onDelete('cascade');
			table.foreign('room_id').references('id').on('rooms').onDelete('cascade');
		});
	}

	down () {
		this.drop('room_equipment');
	}
}

module.exports = RelationsSchema;
