'use strict';

const Axios = require('axios');
const Room = use('App/Models/Room');

class ChatbotController {
	constructor ({ socket, request }) {
		this.socket = socket;
		this.request = request;
	}

	async onMessage (message) {
		console.log(message);

		const url = 'https://api.wit.ai/message';
		const headers = {
			'Authorization': 'Bearer D2TSQTSEYR7I3S7J53S6R7FVNORMRYFO'
		};

		const params = {
			v: '20190313',
			q: message.body
		};

		const result = await Axios.get(url, {
			headers: headers,
			params: params
		});
		const entities = result.data.entities;

		let room;
		if (entities.room_number) {
			room = (await Room
				.query()
				.whereRaw(`name LIKE '${entities.room_number[0].value}%'`)
				.fetch()).toJSON()[0];
		}

		let datetime;
		if (entities.datetime) {
			datetime = entities.datetime[0];
		}

		console.log(entities);
		console.log();

		this.socket.broadcastToAll('message', { room: room, datetime: datetime });
	}
}

module.exports = ChatbotController;
