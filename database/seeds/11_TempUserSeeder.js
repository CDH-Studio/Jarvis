'use strict';

/*
|--------------------------------------------------------------------------
| TEMP User Seeder
|--------------------------------------------------------------------------
|
| Seed table with user accounts for dev purposes
|
*/
const Users = use('App/Models/User');

class TempUserSeeder {
	async run () {
		console.log('Users DB: No seeding required. Will use AD.');
	}
}

module.exports = TempUserSeeder;
