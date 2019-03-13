let ws = null;

$(function () {
	startChat();
});

function startChat () {
	ws = adonis.Ws().connect();

	ws.on('open', () => {
		$('.connection-status').addClass('connected');
		subscribeToChannel();
	});

	ws.on('error', () => {
		$('.connection-status').removeClass('connected');
	});
}

function subscribeToChannel () {
	const chat = ws.subscribe('chat');

	chat.on('error', () => {
		$('.connection-status').removeClass('connected');
	});

	chat.on('message', (message) => {
		$('.messages').append(`
			<div class="message"><h3> ${message.username} </h3> <p> ${message.body} </p> </div>
		`);
	});
}

function send() {
	const message = $('#message').val();
	$('#message').val('');

	ws.getSubscription('chat').emit('message', {
		body: message
	});
}