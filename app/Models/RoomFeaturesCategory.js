'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class RoomFeaturesCategory extends Model {
	static get table () {
		return 'room_features_categories';
	}

	features () {
		return this.hasMany('App/Models/RoomFeature', 'id', 'feature_category_id');
	}
}

module.exports = RoomFeaturesCategory;
