'use strict';

/*
|--------------------------------------------------------------------------
| Report Type Seeder
|--------------------------------------------------------------------------
|
| Seed table with report types
|
*/
const ReportType = use('App/Models/ReportType');

class ReportTypeSeeder {
	async run () {
		// load in dummy data for report types
		let TypeFiller = require('../seederData/report_types.json');

		// count report types in database
		const count = parseInt(await ReportType.getCount());

		if (count === 0) {
			for (var i = 0; i < TypeFiller.length; i++) {
				const type = new ReportType();
				type.name = TypeFiller[i]['name'];
				await type.save();
			}
			console.log('Report Type DB: Finished Seeding');
		} else {
			console.log('Report Type DB: Already Seeded');
		}
	}
}

module.exports = ReportTypeSeeder;
