'use strict';

const Model = use('Model');

class Room extends Model {
	bookings () {
		return this.hasMany('App/Models/Booking');
	}

	reviews () {
		return this.hasMany('App/Models/Review');
	}

	reports () {
		return this.hasMany('App/Models/Report');
	}

	static get table () {
		return 'rooms';
	}
}

module.exports = Room;
