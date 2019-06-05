'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RoomsSchema extends Schema {
	up () {
		this.create('rooms', (table) => {
			table.increments();
			table.string('name', 20).notNullable().unique();
			table.string('fullName', 100).notNullable();
			table.integer('floor_id').unsigned().references('id').inTable('floors').notNullable();
			table.integer('tower_id').unsigned().references('id').inTable('towers').notNullable();
			table.integer('building_id').unsigned().references('id').inTable('buildings').notNullable();
			table.string('telephone', 20);
			table.integer('seats').notNullable();
			table.integer('capacity').notNullable();
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
			table.integer('avg_rating').unsigned().notNullable().defaultTo(0);
			table.integer('state_id').notNullable();
			table.timestamps();

			const query = require('../rawQueries/populateRoomsOutlook');
			this.raw(query);
		});
	}

	down () {
		this.drop('rooms');
	}
}

module.exports = RoomsSchema;
