'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class FeaturesRoomsPivot extends Model {
	static get table () {
		return 'features_rooms_pivot';
	}

	feature () {
		return this.belongsTo('App/Models/RoomFeature', 'feature_id', 'id');
	}

	rooms () {
		return this.belongsTo('App/Models/RoomFeature', 'room_id', 'id');
	}
}

module.exports = FeaturesRoomsPivot;
