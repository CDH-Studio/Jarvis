'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomsSchema extends Schema {
  up () {
    this.create('rooms', (table) => {
      table.string('name', 20).notNullable().unique()
      table.string('location', 100).notNullable()
      table.string('telephone', 20)
      table.integer('seats', 500).notNullable()
      table.integer('capacity', 500).notNullable()
      table.bool('projector').notNullable()
      table.bool('whiteboard').notNullable()
      table.string('floorplan', 100)
      table.string('picture', 100)
      table.primary('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('rooms')
  }
}

module.exports = RoomsSchema
