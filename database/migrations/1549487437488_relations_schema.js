'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RelationsSchema extends Schema {
	up() {
		this.create('user_room', (table) => {
			table.string('username', 80).notNullable()
			table.string('roomname', 20).notNullable()
			table.primary('username', 'roomname')
			table.foreign('username').references('username').on('users').onDelete('cascade')
			table.foreign('roomname').references('name').on('rooms').onDelete('cascade')
		})

		this.create('room_equipment', (table) => {
			table.string('roomname', 20).notNullable()
			table.integer('id').notNullable()
			table.primary('id', 'roomname')
			table.foreign('id').references('id').on('equipments').onDelete('cascade')
			table.foreign('roomname').references('name').on('rooms').onDelete('cascade')
		})
	}

	down() {
		this.drop('user_room')
		this.drop('room_equipment')
	}
}

module.exports = RelationsSchema
