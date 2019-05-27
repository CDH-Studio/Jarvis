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
		var userFiller = [{ firstname: 'Peter', lastname: 'Admin', email: 'plamq068@uottawa.ca', password: '123', floor: '3', tower: '1', role_id: '1', verified: 1 },
			{ firstname: 'Peter', lastname: 'User', email: 'peter.quach.lam@gmail.com', password: '1234', floor: '2', tower: '2', role_id: '2', verified: 1 },
			{ firstname: 'Majd', lastname: 'Admin', email: 'majd.khodr15@gmail.com', password: '123', floor: '5', tower: '1', role_id: '1', verified: 1 },
			{ firstname: 'Majd', lastname: 'User', email: 'majd.khodr@hotmail.com', password: '123', floor: '6', tower: '2', role_id: '2', verified: 1 },
			{ firstname: 'Yunwei', lastname: 'Admin', email: 'yunwei.li@carleton.ca', password: '123', floor: '8', tower: '1', role_id: '1', verified: 1 },
			{ firstname: 'Yunwei', lastname: 'User', email: 'ylithrowaway@gmail.com', password: '123', floor: '8', tower: '2', role_id: '2', verified: 1 },
			{ firstname: 'Yunwei', lastname: 'Li', email: 'yunwei.li@canada.ca', password: '123', floor: '3', tower: '2', role_id: '2', verified: 1 },
			{ firstname: 'Ali', lastname: 'Admin', email: 'admin@gmail.com', password: '123456', floor: '5', tower: '2', role_id: '1', verified: 1 },
			{ firstname: 'Ali', lastname: 'User', email: 'user@gmail.com', password: '123456', floor: '2', tower: '2', role_id: '2', verified: 1 },
			{ firstname: 'Mena', lastname: 'Machado', email: 'mena.machado@canada.ca', password: '123', floor: '3', tower: '2', role_id: '2', verified: 1 },
			{ firstname: 'Annie', lastname: 'Belanger', email: 'annie.belanger2@canada.ca', password: '123', floor: '3', tower: '2', role_id: '2', verified: 1 }
		];

		var count = await Users.getCount();

		if (count === 0) {
			for (var i = 0; i < userFiller.length; i++) {
				const user = new Users();
				user.firstname = userFiller[i].firstname;
				user.lastname = userFiller[i].lastname;
				user.email = userFiller[i].email;
				user.password = userFiller[i].password;
				user.floor = userFiller[i].floor;
				user.tower = userFiller[i].tower;
				user.role_id = userFiller[i].role_id;
				user.verified = userFiller[i].verified;
				await user.save();
			}
			console.log('Users DB: Finished Seeding');
		} else {
			console.log('Users Status DB: Already Seeded');
		}
	}
}

module.exports = TempUserSeeder;
