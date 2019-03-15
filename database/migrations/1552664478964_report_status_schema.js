'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ReportStatusSchema extends Schema {
	up () {
		this.create('report_statuses', (table) => {
			table.increments();
			table.string('name', 20).notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('report_statuses');
	}
}

module.exports = ReportStatusSchema;
