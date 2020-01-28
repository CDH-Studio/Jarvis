'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Env = use('Env');

class RoomsSchema extends Schema {
	up () {
		console.log('starting Migration: Rooms');

		this.create('rooms', (table) => {
			table.increments();
			table.string('name', 20).notNullable().unique();
			table.string('fullName', 100).notNullable();
			table.integer('floor_id').unsigned().references('id').inTable('floors').notNullable();
			table.integer('tower_id').unsigned().references('id').inTable('towers').notNullable();
			table.integer('building_id').unsigned().references('id').inTable('buildings').notNullable();
			table.string('telephone', 30);
			table.integer('seats').notNullable();
			table.integer('capacity').notNullable();
			table.string('extraEquipment', 100);
			table.string('comment', 100);
			table.string('floorplan', 100);
			table.string('floorplan_small', 100);
			table.string('picture', 100);
			table.string('picture_small', 100);
			table.string('calendar', 250).defaultTo('insertCalendarHere');
			table.integer('avg_rating').unsigned().notNullable().defaultTo(0);
			table.integer('state_id').notNullable();
			table.timestamps();

			console.log('Done Migration: Rooms');
		});
	}

	down () {
		this.drop('rooms');
	}
}

module.exports = RoomsSchema;
