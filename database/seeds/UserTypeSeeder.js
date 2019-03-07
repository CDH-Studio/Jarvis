'use strict'

/*
|--------------------------------------------------------------------------
| UserTypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const UserTypes = use('App/Models/UserType');

class UserTypeSeeder {
  	async run () {
	  	var userTypesFiller=['admin','user'];
	  	var count= await UserTypes.getCount();

	  	if(count==0){
		  	for(var i=0; i<userTypesFiller.length;i++){
				const type = new UserTypes();
				type.role_name = userTypesFiller[i];
				await type.save();
			}
			console.log("User Type DB: Finished Seeding");
		}else{
			console.log("User Type DB: Already Seeded");
		}
  	}
}

module.exports = UserTypeSeeder
