'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RoomsSchema extends Schema {
	up () {
		this.create('rooms', (table) => {
			table.increments();
			table.string('name', 20).notNullable().unique();
			table.string('fullName', 100).notNullable();
			table.integer('floor', 3).notNullable();
			table.string('tower', 5).notNullable();
			table.string('telephone', 20);
			table.integer('seats', 500).notNullable();
			table.integer('capacity', 500).notNullable();
			table.bool('projector');
			table.bool('whiteboard');
			table.bool('flipchart');
			table.bool('audioConference');
			table.bool('videoConference');
			table.bool('surfaceHub');
			table.bool('pc');
			table.string('extraEquipment', 100);
			table.string('comment', 100);
			table.string('floorplan', 100);
			table.string('picture', 100);
			table.string('calendar', 250).defaultTo('insertCalendarHere');
			table.integer('state').notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('rooms');
	}
}

module.exports = RoomsSchema;
