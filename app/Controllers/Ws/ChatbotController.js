'use strict';

class ChatbotController {
	constructor ({ socket, request }) {
		this.socket = socket;
		this.request = request;
	}

	onMessage (message) {
		console.log(message);

		this.socket.broadcastToAll('message', message);
	}
}

module.exports = ChatbotController;
