'use strict';
const Room = use('App/Models/Room');
const User = use('App/Models/User');
const Report = use('App/Models/Report');
const ReportStatus = use('App/Models/ReportStatus');
const ReportType = use('App/Models/ReportType');
const moment = require('moment');

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
	async editIssue ({ response, params, view }) {
		try {
			// get the search form data if employee view
			let issue = await Report.query().where('id',params.id).with('user').with('room').fetch();
			issue = issue.toJSON();
			return view.render('adminPages.editIssue', { id: params.id, issue: issue[0], moment});
		} catch (error) {
			console.log(error);
			return response.redirect('/');
		}
	}

	/**
	* Update the database with new issue information and render's rooms issue page afterwards
	*
	* @param {Object} Context The context object.
	*/
	async updateIssue ({ response, params, request, view, session }) {
		try {
			const { issueType, comment, roomID, issueStatus } = request.only(['issueType', 'comment', 'roomID', 'userID', 'issueStatus']);
			const date = new Date();

			// Updates room information in database
			let issue = await Report.findByOrFail('id', params.id);
			issue.report_type_id = issueType;
			issue.comment = comment;
			issue.report_status_id = issueStatus;
			issue.updated_at = date;
			issue.save();

			session.flash({ notification: 'Issue Updated!' });

			return response.route('editIssue', { id: issue.id });
		} catch (error) {
			console.log(error);
			return response.redirect('/');
		}
	}

	/**
	 * Retrives all of the issues that correspond to a specific room.
	 *
	 * @param {Object} Context The context object.
	 */
	async getRoomIssues ({ request, params, view, response }) {

		try{
			let results, issues, currentTime, issuefilterType, roomName, startTimeFilter, endTimeFilter;
			let viewFilters=[];

			// end time for filter is now
			endTimeFilter = moment().format('YYYY-MM-DDTHH:mm');

			// determine time filter for reported issues
			switch (params.timeFilter) {
				case 'month':
					startTimeFilter = moment().startOf('month').format('YYYY-MM-DD hh:mm');
					break;
				case '3-months':
					startTimeFilter = moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD hh:mm');
					break;
				case '6-months':
					startTimeFilter = moment().subtract(6, 'months').startOf('month').format('YYYY-MM-DD hh:mm');
					break;
				case 'year':
					startTimeFilter = moment().subtract(1, 'years').format('YYYY-MM-DD hh:mm');
					break;
				case 'all':
					startTimeFilter = moment().subtract(100, 'years').format('YYYY-MM-DD hh:mm');
					break;
				default:
					return response.route('home');
			}

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
				// filter based on status for all rooms
				if (issuefilterType > 0 && issuefilterType < 4) {
					// open, pending, or closed issues
					results = await Report
						.query()
						.where('building_id', selectedBuilding.id)
						.where('report_status_id', issuefilterType)
						.whereBetween('updated_at', [startTimeFilter, endTimeFilter])
						.with('user')
						.with('room')
						.with('report_type')
						.fetch();
				} else {
					// all issies
					results = await Report.query()
						.where('building_id', selectedBuilding.id)
						.whereBetween('updated_at', [startTimeFilter, endTimeFilter])
						.with('user')
						.with('room')
						.with('report_type')
						.fetch();
				}
			} else {
				// filter based on status if specific room
				// get room name
				const roomResult = await Room.findOrFail(params.roomID);
				roomName = roomResult.name;

				if (issuefilterType > 0 && issuefilterType < 4) {
					results = await Report
						.query()
						.where('room_id', params.roomID)
						.whereBetween('updated_at', [startTimeFilter, endTimeFilter])
						.where('report_status_id', issuefilterType)
						.with('user')
						.with('room')
						.with('report_type')
						.fetch();
				} else {
					results = await Report
						.query()
						.whereBetween('updated_at', [startTimeFilter, endTimeFilter])
						.where('room_id', params.roomID)
						.with('user')
						.with('room')
						.with('report_type')
						.fetch();
				}
			}

			issues = results.toJSON();
			// Retrieve issue stats
			//Ali fix the querys in this function
			const stats = await this.getIssueStatistics(params.roomID, selectedBuilding, startTimeFilter, endTimeFilter);

			viewFilters.timeFilter = params.timeFilter;
			viewFilters.filterType = params.issueStatus;

			return view.render('adminPages.viewRoomIssues', { 
				roomID: params.roomID,
				roomName,
				issues,
				stats,
				viewFilters,
				moment
			});

		} catch (error) {
			console.log(error);
			return response.redirect('/');
		}
		
		
	}

	/**
	* Retrieves the statistics of a all the issues in the database- number of open, pending and closed issues.
	*
	* @param {Object} Context The context object.
	*/
	async getIssueStatistics (roomID, selectedBuilding, startTimeFilter, endTimeFilter) {
		var countPending;
		var countUnderReview;
		var countResolved;

		if (roomID === 'all') {
			// Retrieve number of issues that are pending
			countPending = await Report
				.query()
				.whereBetween('updated_at', [startTimeFilter, endTimeFilter])
				.where('building_id', selectedBuilding.id)
				.where('report_status_id', 1)
				.getCount();

			// Retrieve number of issues that are under review
			countUnderReview = await Report
				.query()
				.whereBetween('updated_at', [startTimeFilter, endTimeFilter])
				.where('building_id', selectedBuilding.id)
				.where('report_status_id', 2)
				.getCount();

			// Retrieve number of issues that are resolved
			countResolved = await Report
				.query()
				.whereBetween('updated_at', [startTimeFilter, endTimeFilter])
				.where('building_id', selectedBuilding.id)
				.where('report_status_id', 3)
				.getCount();
		} else {
			// Retrieve number of issues that are open
			countPending = await Report
				.query()
				.whereBetween('updated_at', [startTimeFilter, endTimeFilter])
				.where('room_id', roomID)
				.where('report_status_id', 1)
				.getCount();

			// Retrieve number of issues that are under review
			countUnderReview = await Report
				.query()
				.whereBetween('updated_at', [startTimeFilter, endTimeFilter])
				.where('room_id', roomID)
				.where('report_status_id', 2)
				.getCount();

			// Retrieve number of issues that are resolved
			countResolved = await Report
				.query()
				.whereBetween('updated_at', [startTimeFilter, endTimeFilter])
				.where('room_id', roomID)
				.where('report_status_id', 3)
				.getCount();
		}

		// Create statistic array with custom keys
		var stats = {};
		stats['total'] = countPending + countUnderReview + countResolved;
		stats['pending'] = countPending;
		stats['underReview'] = countUnderReview;
		stats['resolved'] = countResolved;

		return stats;
	}
}

module.exports = IssueController;
