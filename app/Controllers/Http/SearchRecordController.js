'use strict';
const SearchRecord = use('App/Models/SearchRecord');
const moment = require('moment');

class SearchRecordController {
	async viewSearchRecords ({ view }) {
		const records = (await SearchRecord
			.query()
			.with('user')
			.fetch()).toJSON();
		console.log(records)

		return view.render('adminPages.viewSearchRecords', {
			records,
			moment
		});
	}
}

module.exports = SearchRecordController;
