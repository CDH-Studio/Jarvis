'use strict';
const Room = use('App/Models/Room');
const User = use('App/Models/User');
const Report = use('App/Models/Report');
const ReportStatus = use('App/Models/ReportStatus');
const ReportType = use('App/Models/ReportType');

class IssueController {
	/**
	 * Reports a room
	 *
	 * @param {Object} Context The context object.
	 */
	async submit ({ request, response, session, auth }) {
		const { issueType, comment, room } = request.only(['issueType', 'comment', 'room']);
		const results = await Room
			.findBy('id', room);
		const row = results.toJSON();
		// Populates the review object's values
		const issue = new Report();
		issue.user_id = auth.user.id;
		issue.room_id = row.id;
		issue.report_type_id = issueType;
		issue.comment = comment;
		// Setting default issue status as open
		issue.report_status_id = 1;
		await issue.save();

		session.flash({ notification: 'Your issue has been submitted' });
		return response.route('showRoom', { id: row.id });
	}

	/**
	 * Render a issue and its information.
	 *
	 * @param {Object} Context The context object.
	 */
	async editIssue ({ response, auth, params, view, request }) {
		try {
			// get the search form data if employee view
			const issue = await Report.findOrFail(params.id);
			return view.render('adminDash.editIssue', { id: params.id, issue });
		} catch (error) {
			return response.redirect('/');
		}
	}

	/**
	* Update the database with new issue information and render's rooms issue page afterwards
	*
	* @param {Object} Context The context object.
	*/
	async updateIssue ({ response, auth, params, view, request, session }) {
		try {
			const { issueType, comment, roomID, issueStatus } = request.only(['issueType', 'comment', 'roomID', 'userID', 'issueStatus']);
			const date = new Date();
			// Updates room information in database
			await Report
				.query()
				.where('id', params.id)
				.update({
					report_type_id: issueType,
					comment: comment,
					report_status_id: issueStatus,
					updated_at: date
				});
			session.flash({ notification: 'Issue Updated!' });
			return response.route('roomIssues', { id: roomID });
		} catch (error) {
			return response.redirect('/');
		}
	}

	/**
	 * Retrives all of the issues that correspond to a specific room.
	 *
	 * @param {Object} Context The context object.
	 */
	async getRoomIssues ({ params, view, auth, response }) {
		// Queries the database for the issues associated to a specific room
		let issues = await Report
			.query()
			.where('room_id', params.id)
			.fetch();

		issues = issues.toJSON();

		// Sort the isssues by date
		issues.sort((a, b) => {
			return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
		});

		// Retrieve number of issues that are open
		let countPending = await Report
			.query()
			.where('room_id', params.id)
			.where('report_status_id', 1)
			.count();

		// Retrieve number of issues that are under review
		let countUnderReview = await Report
			.query()
			.where('room_id', params.id)
			.where('report_status_id', 2)
			.count();

		// Retrieve number of issues that are resolved
		let countResolved = await Report
			.query()
			.where('room_id', params.id)
			.where('report_status_id', 3)
			.count();

		// Create statistic array with custom keys
		var stats = {};
		stats['total'] = issues.length;
		stats['pending'] = countPending[0]['count(*)'];
		stats['underReview'] = countUnderReview[0]['count(*)'];
		stats['resolved'] = countResolved[0]['count(*)'];

		// loop through and change ids to the actual names in the tables
		for (let i = 0; i < issues.length; i++) {
			issues[i].status = await ReportStatus.getName(issues[i].report_status_id);
			issues[i].room = await Room.getName(issues[i].room_id);
			issues[i].user = await User.getName(issues[i].user_id);
			issues[i].type = await ReportType.getName(issues[i].report_type_id);
		}
		return view.render('adminDash.viewRoomIssues', { issues, id: issues[0].room, stats });
	}

	/**
	* Renders a specific issue page depending on
	*
	* @param {Object} Context The context object.
	*/
	async renderIssuePage ({ response, params, view }) {
		var results;
		var issues;
		const filterType = params.issueStatus;

		if (filterType === 'all') {
			results = await Report.all();
		} else if (params.issueStatus === 'open') {
			// Retrieve number of issues that are open
			results = await Report
				.query()
				.where('report_status_id', 1)
				.fetch();
		} else if (filterType === 'pending') {
			// Retrieve number of issues that are pendingss
			results = await Report
				.query()
				.where('report_status_id', 2)
				.fetch();
		} else if (filterType === 'closed') {
			// Retrieve number of issues that are pending
			results = await Report
				.query()
				.where('report_status_id', 3)
				.fetch();
		} else {
			return response.redirect('/');
		}

		issues = results.toJSON();

		// Sort the results by name
		issues.sort((a, b) => {
			return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
		});

		// loop through and change ids to the actual names in the tables
		for (let i = 0; i < issues.length; i++) {
			issues[i].status = await ReportStatus.getName(issues[i].report_status_id);
			issues[i].room = await Room.getName(issues[i].room_id);
			issues[i].user = await User.getName(issues[i].user_id);
			issues[i].type = await ReportType.getName(issues[i].report_type_id);
		}

		const stats = await this.getIssueStatistics();

		return view.render('adminDash.viewRoomIssues', { filterType, issues, stats });
	}

	/**
	* Retrieves the statistics of a all the issues in the database- number of open, pending and closed issues.
	*
	* @param {Object} Context The context object.
	*/
	async getIssueStatistics () {
		// Retrieve number of issues that are pending
		let countPending = await Report
			.query()
			.where('report_status_id', 1)
			.count();

		// Retrieve number of issues that are under review
		let countUnderReview = await Report
			.query()
			.where('report_status_id', 2)
			.count();

		// Retrieve number of issues that are resolved
		let countResolved = await Report
			.query()
			.where('report_status_id', 3)
			.count();

		// Create statistic array with custom keys
		var stats = {};
		stats['total'] = countPending[0]['count(*)'] + countUnderReview[0]['count(*)'] + countResolved[0]['count(*)'];
		stats['pending'] = countPending[0]['count(*)'];
		stats['underReview'] = countUnderReview[0]['count(*)'];
		stats['resolved'] = countResolved[0]['count(*)'];

		return stats;
	}
}

module.exports = IssueController;
