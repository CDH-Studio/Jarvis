'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BookingSchema extends Schema {
	up () {
		this.create('bookings', (table) => {
			table.increments();
			table.timestamps();
			table.string('subject', 100);
			table.datetime('from');
			table.datetime('to');
		});
	}

	down () {
		this.drop('bookings');
	}
}

module.exports = BookingSchema;
