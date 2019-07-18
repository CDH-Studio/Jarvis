'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Booking extends Model {
	user () {
		return this.belongsTo('App/Models/User');
	}

	room () {
		return this.belongsTo('App/Models/Room', 'room_id');
	}

	floor () {
    	return this.belongsToThrough('App/Models/Room', 'floors')
  	}
}

module.exports = Booking;
