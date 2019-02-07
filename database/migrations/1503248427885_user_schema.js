'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.int('role').notNullable()
      table.timestamps()
    })

    this.create('password_reset_requests', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      table.string('hash', 254).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
    this.drop('password_reset_requests')
  }
}

module.exports = UserSchema
