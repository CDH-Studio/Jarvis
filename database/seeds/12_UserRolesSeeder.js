'use strict';

/*
|--------------------------------------------------------------------------
| UserRolesSeeder
|--------------------------------------------------------------------------
|
| seed user Roles table
| make use of Lucid models directly.
|
*/

const UserRole = use('App/Models/UserRole');

class UserRolesSeeder {
	async run () {
		// load in dummy data for report types
		let userRolesFiller = require('../seederData/user_roles.json');

		// count report types in database
		const count = parseInt(await UserRole.getCount());

		if (count === 0) {
			for (var i = 0; i < userRolesFiller.length; i++) {
				const type = new UserRole();
				type.name = userRolesFiller[i]['name'];
				await type.save();
			}
			console.log('User Type DB: Finished Seeding');
		} else {
			console.log('User Type DB: Already Seeded');
		}
	}
}

module.exports = UserRolesSeeder;
