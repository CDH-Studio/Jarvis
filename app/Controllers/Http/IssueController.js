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
		issue.building_id = 1;
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
			return view.render('adminPages.editIssue', { id: params.id, issue });
		} catch (error) {
			return response.redirect('/');
		}
	}

	/**
	* Update the database with new issue information and render's rooms issue page afterwards
	*
	* @param {Object} Context The context object.
	*/
	async updateIssue ({ response, params, request, session }) {
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
			return response.route('showIssue', { roomID: roomID, issueStatus: 'all' });
		} catch (error) {
			return response.redirect('/');
		}
	}

	/**
	 * Retrives all of the issues that correspond to a specific room.
	 *
	 * @param {Object} Context The context object.
	 */
	async getRoomIssues ({ request, params, view, response }) {
		var results;
		var issues;
		var currentTime;
		var issuefilterType;
		var roomName;

		// covert status string to int
		if (params.issueStatus === 'all') {
			issuefilterType = 0;
		} else if (params.issueStatus === 'open') {
			issuefilterType = 1;
		} else if (params.issueStatus === 'pending') {
			issuefilterType = 2;
		} else if (params.issueStatus === 'closed') {
			issuefilterType = 3;
		}

		const selectedBuilding = request.cookie('selectedBuilding');

		// refine filter by room requested
		if (params.roomID === 'all') {
			// filter based on status
			if (issuefilterType > 0 && issuefilterType < 4) {
				results = await Report
					.query()
					.where('building_id', selectedBuilding.id)
					.where('report_status_id', issuefilterType)
					.fetch();
			} else {
				results = await Report.query()
					.where('building_id', selectedBuilding.id)
					.fetch();
			}
		} else {
			// for security check if room number is actually an int
			params.roomID = parseInt(params.roomID);
			if (isNaN(params.roomID)) {
				return response.redirect('/');
			}

			// get room name
			const roomResult = await Room.find(params.roomID);
			roomName = roomResult.name;

			if (issuefilterType > 0 && issuefilterType < 4) {
				results = await Report
					.query()
					.where('room_id', params.roomID)
					.where('report_status_id', issuefilterType)
					.fetch();
			} else {
				results = await Report
					.query()
					.where('room_id', params.roomID)
					.fetch();
			}
		}

		issues = results.toJSON();
		// Retrieve issue stats
		const stats = await this.getIssueStatistics(params.roomID, selectedBuilding);

		// date formatting options
		var options = { year: 'numeric', month: 'long', day: 'numeric' };

		// loop through and change ids to the actual names in the tables
		// TODO: needs to be changed to take advantage of relational database
		for (let i = 0; i < issues.length; i++) {
			issues[i].status = await ReportStatus.getName(issues[i].report_status_id);
			issues[i].room = await Room.getName(issues[i].room_id);
			issues[i].user = await User.getName(issues[i].user_id);
			issues[i].type = await ReportType.getName(issues[i].report_type_id);
			currentTime = new Date(issues[i].created_at);
			issues[i].created_at = currentTime.toLocaleDateString('de-DE', options);
		}

		return view.render('adminPages.viewRoomIssues', { roomID: params.roomID, roomName, issues, stats, filterType: params.issueStatus });
	}

	/**
	* Retrieves the statistics of a all the issues in the database- number of open, pending and closed issues.
	*
	* @param {Object} Context The context object.
	*/
	async getIssueStatistics (roomID, selectedBuilding) {
		var countPending;
		var countUnderReview;
		var countResolved;

		if (roomID === 'all') {
			// Retrieve number of issues that are pending
			countPending = await Report
				.query()
				.where('building_id', selectedBuilding.id)
				.where('report_status_id', 1)
				.count();

			// Retrieve number of issues that are under review
			countUnderReview = await Report
				.query()
				.where('building_id', selectedBuilding.id)
				.where('report_status_id', 2)
				.count();

			// Retrieve number of issues that are resolved
			countResolved = await Report
				.query()
				.where('building_id', selectedBuilding.id)
				.where('report_status_id', 3)
				.count();
		} else {
			// Retrieve number of issues that are open
			countPending = await Report
				.query()
				.where('room_id', roomID)
				.where('report_status_id', 1)
				.count();

			// Retrieve number of issues that are under review
			countUnderReview = await Report
				.query()
				.where('room_id', roomID)
				.where('report_status_id', 2)
				.count();

			// Retrieve number of issues that are resolved
			countResolved = await Report
				.query()
				.where('room_id', roomID)
				.where('report_status_id', 3)
				.count();
		}

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
