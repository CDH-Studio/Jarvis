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
			<p> ${message.body} </p> </div>
		`);
	});
}

function openChat () {
	document.getElementById('chat-popup').style.display = 'block';
}

function closeChat () {
	document.getElementById('chat-popup').style.display = 'none';
}

function send () {
	const message = $('#message').val();
	$('#message').val('');

	ws.getSubscription('chat').emit('message', {
		body: message
	});
}
