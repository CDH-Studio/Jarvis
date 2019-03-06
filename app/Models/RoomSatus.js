'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RoomSatus extends Model {

	static get table () {
    	return 'room_statuses'
  	}
}

module.exports = RoomSatus
