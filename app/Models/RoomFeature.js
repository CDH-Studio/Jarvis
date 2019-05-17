'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class RoomFeature extends Model {
	static get table () {
		return 'room_features';
	}

	category () {
		return this.belongsTo('App/Models/RoomFeaturesCategory', 'feature_category_id')
	}
}

module.exports = RoomFeature;