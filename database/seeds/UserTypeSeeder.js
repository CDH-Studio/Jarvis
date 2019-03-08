'use strict';

/*
|--------------------------------------------------------------------------
| UserTypeSeeder
|--------------------------------------------------------------------------
|
| seed user Roles table
| make use of Lucid models directly.
|
*/

const UserTypes = use('App/Models/UserType');

class UserTypeSeeder {
	async run () {
		var userTypesFiller = ['admin', 'user'];
		var count = await UserTypes.getCount();

		if (count === 0) {
			for (var i = 0; i < userTypesFiller.length; i++) {
				const type = new UserTypes();
				type.role_name = userTypesFiller[i];
				await type.save();
			}
			console.log('User Type DB: Finished Seeding');
		} else {
			console.log('User Type DB: Already Seeded');
		}
	}
}

module.exports = UserTypeSeeder;
