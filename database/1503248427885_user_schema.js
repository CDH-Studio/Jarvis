'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
	up () {
		this.create('users', (table) => {
			table.increments();
			table.string('firstname', 80).notNullable();
			table.string('lastname', 80).notNullable();
			table.string('email', 254).notNullable().unique();
			table.string('password', 60).notNullable();
			table.integer('floor');
			table.integer('tower');
			table.integer('role').notNullable();
			table.bool('verified').notNullable();
			table.timestamps();
		});

		this.create('account_requests', (table) => {
			table.increments();
			table.string('email', 254).notNullable();
			table.string('hash', 254).notNullable().unique();
			table.integer('type').notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('users');
		this.drop('account_requests');
	}
}

module.exports = UserSchema;
