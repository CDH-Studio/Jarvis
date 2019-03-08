'use strict';

const Model = use('Model');

class Room extends Model {
	bookings () {
		return this.hasMany('App/Models/Booking');
	}

	static get table () {
		return 'rooms';
	}
}

module.exports = Room;
