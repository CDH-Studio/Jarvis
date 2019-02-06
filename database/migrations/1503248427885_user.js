'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (collection) => {
      collection.index('email_index', {email: 1}, {unique: true})
    });
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
