'use strict';

const Model = use('Model');

class Room extends Model {
	bookings () {
		return this.hasMany('App/Models/Booking');
	}

	reviews () {
		return this.hasMany('App/Models/Review');
	}

	static get table () {
		return 'rooms';
	}
}

module.exports = Room;
