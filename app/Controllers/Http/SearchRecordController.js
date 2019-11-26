'use strict';
const SearchRecord = use('App/Models/SearchRecord');
const moment = require('moment');

class SearchRecordController {
	async viewSearchRecords ({ view }) {
		const start = moment().subtract(180, 'days').endOf('day').format('YYYY-MM-DD');

		const records = (await SearchRecord
			.query()
			.with('user')
			.where('created_at', '>', start)
			.fetch()).toJSON();

		return view.render('adminPages.viewSearchRecords', {
			records,
			moment
		});
	}
}

module.exports = SearchRecordController;
