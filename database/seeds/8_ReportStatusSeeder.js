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
		// load in dummy data for report statuses
		let StatusFiller = require('../seederData/report_statuses.json');

		// count report statuses in database
		var count = parseInt(await ReportStatus.getCount());

		if (count === 0) {
			for (var i = 0; i < StatusFiller.length; i++) {
				const status = new ReportStatus();
				status.name = StatusFiller[i]['name'];
				await status.save();
			}
			console.log('Report Status DB: Finished Seeding');
		} else {
			console.log('Report Status DB: Already Seeded');
		}
	}
}

module.exports = ReportStatusSeeder;
