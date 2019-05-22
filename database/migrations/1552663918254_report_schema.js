'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ReportSchema extends Schema {
	up () {
		this.create('reports', (table) => {
			table.increments();
			table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
			table.integer('building_id').unsigned().references('id').inTable('rooms').notNullable();
			table.integer('room_id').unsigned().references('id').inTable('rooms').notNullable();
			table.integer('report_type_id').unsigned().references('id').inTable('report_type').notNullable();
			table.string('comment', 250);
			table.integer('report_status_id').unsigned().references('id').inTable('report_status').notNullable();
			table.timestamps();
		});
	}

	down () {
		this.drop('reports');
	}
}
module.exports = ReportSchema;
