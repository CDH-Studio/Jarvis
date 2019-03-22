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
		const report = new Report();
		report.user_id = auth.user.id;
		report.room_id = row.id;
		report.report_type_id = issueType;
		report.comment = comment;
		// Setting default issue status as open
		report.report_status_id = 1;
		await report.save();

		session.flash({ notification: 'Your report has been submitted' });
		return response.route('showRoom', { id: row.id });
	}

	/**
	 * Query all the rooms from the database and render a page to display all current user reports for rooms (ADMIN only)
	 *
	 * @param {Object} Context The context object.
	 */
	async getAllIssues ({ auth, view, response }) {
		const results = await Report.all();
		const reports = results.toJSON();

		// Sort the results by name
		reports.sort((a, b) => {
			return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
		});

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
		stats['total'] = reports.length;
		stats['pending'] = countPending[0]['count(*)'];
		stats['underReview'] = countUnderReview[0]['count(*)'];
		stats['resolved'] = countResolved[0]['count(*)'];

		// loop through and change ids to the actual names in the tables
		for (let i = 0; i < reports.length; i++) {
			reports[i].status = await ReportStatus.getName(reports[i].report_status_id);
			reports[i].room = await Room.getName(reports[i].room_id);
			reports[i].user = await User.getName(reports[i].user_id);
			reports[i].type = await ReportType.getName(reports[i].report_type_id);
		}

		// if user is admin
		return view.render('adminDash.viewAllIssues', { reports, stats });
	}

	/**
	 * Retrives all of the issues that correspond to a specific room.
	 *
	 * @param {Object} Context The context object.
	 */
	async getRoomIssues ({ params, view, auth, response }) {
		var layoutType;
		const userRole = await auth.user.getUserRole();
		// checking if user is admin, otherwise redirect to home
		if (userRole === 'admin') {
			layoutType = 'layouts/adminLayout';
		} else {
			return response.redirect('/');
		}

		// Queries the database for the issues/reports associated to a specific room
		let issues = await Report
			.query()
			.where('room_id', params.id)
			.fetch();

		issues = issues.toJSON();

		// Sort the isssues by date
		issues.sort((a, b) => {
			return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
		});

		// Retrieve number of issues that are pending
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
		return view.render('adminDash.viewRoomIssues', { issues, layoutType, id: issues[0].room, stats });
	}

	/**
	 * Render a issue and its information.
	 *
	 * @param {Object} Context The context object.
	 */
	async showIssue ({ response, auth, params, view, request }) {
		try {
			// get the search form data if employee view
			const issue = await Report.findOrFail(params.id);
			const userRole = await auth.user.getUserRole();
			var layoutType;
			// if user is admin
			if (userRole === 'admin') {
				layoutType = 'layouts/adminLayout';
			} else {
				return response.redirect('/');
			}
			return view.render('adminDash.editIssue', { id: params.id, issue, layoutType });
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
}

module.exports = IssueController;
