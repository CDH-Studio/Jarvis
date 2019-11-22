'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SearchRecordSchema extends Schema {
  up () {
    this.create('search_records', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('type', 20).notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('search_records')
  }
}

module.exports = SearchRecordSchema
