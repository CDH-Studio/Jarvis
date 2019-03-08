'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserTypesSchema extends Schema {
	up () {
		this.create('user_types', (table) => {
			table.increments();
			table.string('role_name', 20).notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('user_types');
	}
}

module.exports = UserTypesSchema;
