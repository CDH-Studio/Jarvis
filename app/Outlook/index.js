'use strict';
const axios = require('axios');
const Env = use('Env');
const Logger = use('Logger');
const Mail = use('Mail');
const Token = use('App/Models/Token');
const graph = require('@microsoft/microsoft-graph-client');

/**
 * Retrieve access token for Microsoft Graph from the data basebase.
 *
 * @returns {Object} The access token.
 *
 */
async function getAccessToken () {
	try {
		const results = await Token.findBy('type', 'access');
		const accessToken = results.toJSON().token;
		return accessToken;
	} catch (err) {
		Logger.debug(err);
		return null;
	}
}

module.exports = class Outlook {
	/**
     * Send an email.
     *
     * @param {string} subject  Subject of Email
     * @param {string} body     Body of Email
     * @param {string} to       Sending address
     */
	async sendMail ({ subject, body, to }) {
		if (!Env.get('DEV_OUTLOOK', false)) {
			await axios.post(`${Env.get('EXCHANGE_AGENT_SERVER', 'http://localhost:3000')}/send`, {
				to,
				subject,
				body
			});
			Logger.info('mail sent');
		} else {
			Mail.raw(body, (message) => {
				message
					.to(to)
					.from('support@mail.cdhstudio.ca')
					.subject(subject);
			});
			Logger.info('mail sent');
		}
	}

	/**
	 *
	 * @param {String} date     Date
	 * @param {String} from     Starting time
	 * @param {String} to       Ending time
	 * @param {String} calendar Calendar ID
	 *
	 * @returns {Boolean} Whether or not the room is available
	 */
	async getRoomAvailability ({ date, from, to, floor, calendar }) {
		console.log('dev', typeof (Env.get('DEV_OUTLOOK', false)), Env.get('DEV_OUTLOOK', false));
		if (!Env.get('DEV_OUTLOOK', false)) {
			const res = await axios.post(`${Env.get('EXCHANGE_AGENT_SERVER', 'localhost:3000')}/avail`, {
				room: calendar,
				start: date + 'T' + from,
				end: date + 'T' + to,
				floor: floor
			});

			return res.data === 'free';
		} else {
			const startTime = date + 'T' + from;
			const endTime = date + 'T' + to;
			// if there is a calendar for the room
			if (calendar !== 'insertCalendarHere' && calendar !== null) {
				// query the events within the search time range
				const calendarViews = (await this.getCalendarView(
					calendar,
					startTime,
					endTime
				)).value;

				// if event end time is the same as search start time, remove the event
				calendarViews.forEach((item, index, items) => {
					const eventEndTime = new Date(item.end.dateTime);
					const searchStartTime = new Date(startTime);

					if (+eventEndTime === +searchStartTime) {
						items.splice(index, 1);
					}
				});

				return calendarViews.length === 0;
			}
		}
	}

	/**
	 * Create an event on the specified room calendar.
	 *
	 * @param {String} eventInfo Information of the event.
	 * @param {Object} booking The Booking (Lucid) Model.
	 * @param {Object} user The User (Lucid) Model.
	 * @param {Object} room The Room (Lucid) Model.
	 * @param {String} calendarId The id of the room calendar.
	 */
	async createEvent ({ eventInfo, booking, user, room, calendarId }) {
		if (!Env.get('DEV_OUTLOOK', false)) {
			try {
				const res = await axios.post(`${Env.get('EXCHANGE_AGENT_SERVER', 'localhost:3000')}/booking`, {
					room: room.calendar,
					start: eventInfo.start.dateTime,
					end: eventInfo.end.dateTime,
					subject: eventInfo.subject,
					body: eventInfo.body.content,
					floor: room.floor_id,
					attendees: [user.email]
				});

				const eventId = res.data.eventId.UniqueId;

				booking.from = eventInfo.start.dateTime;
				booking.to = eventInfo.end.dateTime;
				booking.event_id = eventId;
				booking.status = 'Approved';
				await user.bookings().save(booking);
				await room.bookings().save(booking);

				return eventInfo;
			} catch (err) {
				console.log(err);
				booking.status = 'Failed';
				await user.bookings().save(booking);
				await room.bookings().save(booking);
			}
		} else {
			const accessToken = await getAccessToken();

			if (accessToken) {
				const client = graph.Client.init({
					authProvider: (done) => {
						done(null, accessToken);
					}
				});

				try {
					const newEvent = await client
						.api(`/me/calendars/${calendarId}/events`)
						.post(eventInfo);

					if (newEvent) {
						booking.from = newEvent.start.dateTime;
						booking.to = newEvent.end.dateTime;
						booking.event_id = newEvent.id;
						booking.status = 'Approved';
						await user.bookings().save(booking);
						await room.bookings().save(booking);

						return newEvent;
					}
				} catch (err) {
					console.log(err);
					booking.status = 'Failed';
					await user.bookings().save(booking);
					await room.bookings().save(booking);
				}
			}
		}
	}

	/**
	* Delete an event from the room calendar.
	*
	* @param {String} calendarId The id of the room calendar.
	* @param {String} eventId The id of the event to delete.
	*/
	async deleteEvent ({ eventId, floor, calendarId }) {
		if (!Env.get('DEV_OUTLOOK', false)) {
			try {
				const res = await axios.post(`${Env.get('EXCHANGE_AGENT_SERVER', 'localhost:3000')}/cancel`, {
					eventId: eventId,
					floor: floor
				});

				console.log(res);
			} catch (err) {
				console.log(err);
			}
		} else {
			const accessToken = await getAccessToken();

			if (accessToken) {
				const client = graph.Client.init({
					authProvider: (done) => {
						done(null, accessToken);
					}
				});

				try {
					await client
						.api(`/me/calendars/${calendarId}/events/${eventId}`)
						.delete();
				} catch (err) {
					console.log(err);
				}
			}
		}
	}

	async findAvail ({ room, start, end, duration, floor }) {
		const res = await axios.post(`${Env.get('EXCHANGE_AGENT_SERVER', 'http://localhost:3000')}/findAvail`, {
			room,
			floor,
			duration,
			start,
			end
		});

		return res.data;
	}

	async sync ({ eventId, floor }) {
		const res = await axios.post(`${Env.get('EXCHANGE_AGENT_SERVER', 'localhost:3000')}/sync`, {
			eventId,
			floor
		});

		return res.data;
	}

	// dev outlook
	async getCalendarView (calendarId, start, end) {
		const accessToken = await getAccessToken();

		if (accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const calendarView = await client
					.api(`/me/calendars/${calendarId}/calendarView?startDateTime=${start}&endDateTime=${end}`)
					// .orderby('start DESC')
					.header('Prefer', 'outlook.timezone="Eastern Standard Time"')
					.get();

				return calendarView;
			} catch (err) {
				console.log(err);
			}
		}
	}

	/**
	* Query all the room calendars.
	*/
	async getCalendars () {
		const accessToken = await getAccessToken();

		if (accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const calendars = await client
					.api('/me/calendars?top=100')
					// .orderby('createdDateTime DESC')
					.get();

				return calendars;
			} catch (err) {
				console.log(err);
			}
		}
	}

	/**
	* Query the specified room calendar.
	*
	* @param {String} calendarId The id of the room calendar.
	*/
	async getCalendar (calendarId) {
		const accessToken = await getAccessToken();

		if (accessToken) {
			const client = graph.Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				}
			});

			try {
				const calendar = await client
					.api(`/me/calendars/${calendarId}`)
					// .orderby('createdDateTime DESC')
					.get();

				return calendar;
			} catch (err) {
				console.log(err);
			}
		}
	}
};
