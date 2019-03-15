'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ReportType extends Model {
	static get table () {
		return 'report_types';
	}

	static async getReportSatusID (report_type_name) {
		var reportType = await this.findByOrFail('name', report_type_name);
		return reportType.id;
	}

	static async getReportStatusName (report_type_id) {
		var reportType = await this.findOrFail(this.report_type_id);
		return reportType.name;
	}
}

module.exports = ReportType;
