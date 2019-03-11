'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EquipmentSchema extends Schema {
	up () {
		this.create('equipments', (table) => {
			table.increments();
			table.string('name', 100).notNullable().unique();
			table.timestamps();
		});
	}

	down () {
		this.drop('equipments');
	}
}

module.exports = EquipmentSchema;
