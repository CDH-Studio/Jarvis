'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ReportTypeSchema extends Schema {
	up () {
		this.create('report_types', (table) => {
			table.increments();
			table.string('name', 20).notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('report_types');
	}
}
module.exports = ReportTypeSchema;
