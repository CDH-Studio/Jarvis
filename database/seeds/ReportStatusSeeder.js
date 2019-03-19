'use strict';

/*
|--------------------------------------------------------------------------
| Report Status Seeder
|--------------------------------------------------------------------------
|
| Seed table with report statuses
|
*/
const ReportStatus = use('App/Models/ReportStatus');

class ReportStatusSeeder {
	async run () {
		var StatusFiller = ['Open', 'Pending', 'Closed'];
		var count = await ReportStatus.getCount();

		if (count === 0) {
			for (var i = 0; i < StatusFiller.length; i++) {
				const status = new ReportStatus();
				status.name = StatusFiller[i];
				await status.save();
			}
			console.log('Report Status DB: Finished Seeding');
		} else {
			console.log('Report Status DB: Already Seeded');
		}
	}
}

module.exports = ReportStatusSeeder;
