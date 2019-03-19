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

class ReportStatusSeeder {
	async run () {
		var nameFiller = ['Open', 'Pending', 'Closed'];
		var count = await Users.getCount();

		if (count === 0) {
			for (var i = 0; i < nameFiller.length; i++) {
				const user = new Users();
				user.name = nameFiller[i];
				await user.save();
			}
			console.log('Users DB: Finished Seeding');
		} else {
			console.log('Users Status DB: Already Seeded');
		}
	}
}

module.exports = ReportStatusSeeder;
