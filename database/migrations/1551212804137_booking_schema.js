'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BookingSchema extends Schema {
	up () {
		this.create('bookings', (table) => {
			table.increments();
			table.timestamps();
			table.integer('user_id').unsigned().references('id').inTable('users');
			table.integer('room_id').unsigned().references('id').inTable('rooms');
			table.string('event_id', 250);
			table.string('subject', 100);
			table.datetime('from');
			table.datetime('to');
			table.string('status', 50);
		});
	}

	down () {
		this.drop('bookings');
	}
}

module.exports = BookingSchema;
