'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserType extends Model {

	static get table () {
    	return 'user_types'
  	}

  	user () {
		return this.belongsToMany('App/Model/user')
	}
}

module.exports = UserType
