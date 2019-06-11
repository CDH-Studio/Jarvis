'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BuildingSchema extends Schema {
	up () {
		this.create('buildings', (table) => {
			table.increments();
			table.string('name', 20).notNullable().unique();
			table.string('street_address', 100).notNullable();
			table.string('postal_code', 100).notNullable();
			table.string('city', 100).notNullable();
			table.string('country', 100).notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('buildings');
	}
}

module.exports = BuildingSchema;
