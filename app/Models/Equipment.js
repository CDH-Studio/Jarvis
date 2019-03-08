'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Equipment extends Model {
	static get table () {
		return 'equipments';
	}

	rooms () {
		return this
			.belongsToMany('App/Models/Room')
			.pivotTable('room_equipment');
	}
}

module.exports = Equipment;
