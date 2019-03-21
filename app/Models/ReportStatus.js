'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ReportStatus extends Model {
	static get table () {
		return 'report_statuses';
	}

	static async getID (report_status_name) {
		var reportStatus = await this.findByOrFail('name', report_status_name);
		return reportStatus.id;
	}

	static async getName (report_status_id) {
		var reportStatus = await this.findOrFail(report_status_id);
		return reportStatus.name;
	}
}

module.exports = ReportStatus;
