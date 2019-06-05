'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Tower extends Model {
	building () {
		return this.belongsTo('App/Models/Building', 'building_id');
	}

	room () {
		return this.hasMany('App/Models/Room', 'id', 'tower_id');
	}
}

module.exports = Tower;
