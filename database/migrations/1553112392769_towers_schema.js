'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TowersSchema extends Schema {
	up () {
		this.create('towers', (table) => {
			table.increments();
			table.string('name', 20).notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('towers');
	}
}

module.exports = TowersSchema;
