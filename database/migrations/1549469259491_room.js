'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomsSchema extends Schema {
  up () {
    this.create('rooms', (collection) => {
      collection.index('room_index', {room_name: 1}, {unique: true})
    });
  }

  down () {
    this.drop('rooms')
  }
}

module.exports = RoomsSchema
