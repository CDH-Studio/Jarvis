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
		var userRolesFiller = ['admin', 'user'];
		var count = await UserRole.getCount();

		if (count === 0) {
			for (var i = 0; i < userRolesFiller.length; i++) {
				const type = new UserRole();
				type.name = userRolesFiller[i];
				await type.save();
			}
			console.log('User Type DB: Finished Seeding');
		} else {
			console.log('User Type DB: Already Seeded');
		}
	}
}

module.exports = UserRolesSeeder;
