'use strict';

const Axios = require('axios');

class ChatbotController {
	constructor ({ socket, request }) {
		this.socket = socket;
		this.request = request;
	}

	async onMessage (message) {
		console.log(message);

		const url = 'https://api.wit.ai/message?v=20190313&q=I%20want%20to%20book%20a%20room.';
		const headers = {
			'Authorization': 'Bearer D2TSQTSEYR7I3S7J53S6R7FVNORMRYFO'
		};

		const result = await Axios.get(url, {
			headers: headers
		});
		console.log(result.data.entities);

		this.socket.broadcastToAll('message', message);
	}
}

module.exports = ChatbotController;
