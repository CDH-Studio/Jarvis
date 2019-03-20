'use strict';

/*
|--------------------------------------------------------------------------
| TEMP Issues Seeder
|--------------------------------------------------------------------------
|
| Seed table with room issues/reports for dev purposes
|
*/
const Reports = use('App/Models/Report');

class TempIssuesSeeder {
	async run () {
		var issueFiller = [{ user_id: '', room_id: '', report_type_id: '', commcent: '', report_status_id: '' }];

		var count = await Reports.getCount();

		if (count === 0) {
			for (var i = 0; i < issueFiller.length; i++) {
				const report = new Reports();
				report.user_id = issueFiller[i].user_id;
				report.room_id = issueFiller[i].room_id;
				report.report_type_id = issueFiller[i].report_type_id;
				report.commcent = issueFiller[i].commcent;
				report.report_status_id = issueFiller[i].report_status_id;
				await report.save();
			}
			console.log('Users DB: Finished Seeding');
		} else {
			console.log('Users Status DB: Already Seeded');
		}
	}
}

module.exports = TempIssuesSeeder;
