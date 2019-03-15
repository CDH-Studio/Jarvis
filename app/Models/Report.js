'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Report extends Model {
	user () {
		return this.belongsTo('App/Models/User');
	}

	room () {
		return this.belongsTo('App/Models/Room');
	}

	report_type () {
		return this.belongsTo('App/Models/ReportType');
	}

	report_status () {
		return this.belongsTo('App/Models/ReportStatus');
	}
}

module.exports = Report;
