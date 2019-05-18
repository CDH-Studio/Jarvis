'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RoomFeaturesSchema extends Schema {
	up () {
		this.create('room_features', (table) => {
			table.increments();
			table.string('name', 100).notNullable();
			table.integer('feature_category_id', 4).notNullable();
			table.integer('building_id', 4).notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('room_features');
	}
}

module.exports = RoomFeaturesSchema;
