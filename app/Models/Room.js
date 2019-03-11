'use strict';

const Model = use('Model');

class Room extends Model {
	bookings () {
		return this.hasMany('App/Models/Booking');
	}

	equipments () {
		return this
			.belongsToMany('App/Models/Equipment')
			.pivotTable('room_equipment');
	}

	static get table () {
		return 'rooms';
	}
}

module.exports = Room;
