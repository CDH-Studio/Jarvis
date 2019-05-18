'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Building extends Model {
	tower () {
	    return this.hasMany('App/Models/Tower','id', 'building_id')
	}

	floor () {
	    return this.hasMany('App/Models/Floor','id', 'building_id')
	}

	feature () {
	    return this.hasMany('App/Models/RoomFeature','id', 'building_id')
	}
}

module.exports = Building
