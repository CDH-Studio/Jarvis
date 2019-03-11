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
const Logger = use('Logger');

class UserRolesSeeder {
	async run () {
		var userRolesFiller = ['admin', 'user'];
		var count = await UserRole.getCount();

		if (count === 0) {
			for (var i = 0; i < userRolesFiller.length; i++) {
				const type = new UserRole();
				type.role_name = userRolesFiller[i];
				await type.save();
			}
			Logger.info('User Type DB: Finished Seeding');
		} else {
			Logger.info('User Type DB: Already Seeded');
		}
	}
}

module.exports = UserRolesSeeder;
