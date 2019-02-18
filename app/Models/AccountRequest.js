'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class AccountRequest extends Model {
	static get table () {
		return 'account_requests';
	}
}

module.exports = AccountRequest;
