'use strict';

/** @type {import('@adonisjs/framework/src/Hash')} */
// const Hash = use('Hash');  UNUSED, un-comment if you want to use it
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Room extends Model {
	bookings () {
		return this.hasMany('App/Models/Booking');
	}
}

module.exports = Room;
