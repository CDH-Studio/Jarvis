'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TowersSchema extends Schema {
	up () {
		this.create('towers', (table) => {
			table.increments();
			table.string('name_english', 20).notNullable();
			table.string('name_french', 20).notNullable();
			table.integer('building_id', 4).notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('towers');
	}
}

module.exports = TowersSchema;
