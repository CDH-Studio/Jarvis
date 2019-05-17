'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Floor extends Model {
	static get table () {
		return 'floors';
	}
}

module.exports = Floor;
