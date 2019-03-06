'use strict'

/*
|--------------------------------------------------------------------------
| RoomSatusSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Status = use('App/Models/RoomSatus')


class RoomSatusSeeder {
  	async run () {
	  	var StatusFiller=['available','deactive','maintenance'];
	  	var count= await Status.getCount();

	  	if(count==0){
		  	for(var i=0; i<StatusFiller.length;i++){
				const status = new Status();
				status.name = StatusFiller[i];
				await status.save();
			}
			console.log("Room Status DB: Finished Seeding");
		}else{
			console.log("Room Status DB: Already Seeded");
		}
  	}
}

module.exports = RoomSatusSeeder
