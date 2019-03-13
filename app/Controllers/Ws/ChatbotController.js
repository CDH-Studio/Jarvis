'use strict';

const Axios = require('axios');

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
		console.log(result.data.entities);
		console.log();

		this.socket.broadcastToAll('message', message);
	}
}

module.exports = ChatbotController;
