'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class FeaturesRoomsPivot extends Model {
	static get table () {
		return 'features_rooms_pivot';
	}

	features () {
	    return this.belongsTo('App/Models/RoomFeature','id', 'feature_id')
	}


	rooms () {
	    return this.belongsTo('App/Models/RoomFeature','id', 'room_id')
	}


}

module.exports = FeaturesRoomsPivot;