'use strict';

const Model = use('Model');

class Room extends Model {
	bookings () {
		return this.hasMany('App/Models/Booking');
	}

<<<<<<< HEAD
	reviews () {
		return this.hasMany('App/Models/Review');
=======
	static get table () {
		return 'rooms';
>>>>>>> 377cb7f100308971edababe12be9fd071431eb32
	}
}

module.exports = Room;
