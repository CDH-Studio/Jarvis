'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RoomStatusSchema extends Schema {
	up () {
		this.create('room_statuses', (table) => {
			table.increments();
			table.string('name', 20).notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('room_statuses');
	}
}

module.exports = RoomStatusSchema;
