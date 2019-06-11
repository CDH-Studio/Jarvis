'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RoomFeaturesCategoriesSchema extends Schema {
	up () {
		this.create('room_features_categories', (table) => {
			table.increments();
			table.string('name_english', 50).notNullable();
			table.string('name_french', 50).notNullable();
			table.string('icon', 50).notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('room_features_categories');
	}
}

module.exports = RoomFeaturesCategoriesSchema;
