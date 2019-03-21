'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class RoomStatus extends Model {
	static get table () {
		return 'room_statuses';
	}
}

module.exports = RoomStatus;
