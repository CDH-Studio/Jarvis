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
		const room = message.room;
		const datetime = message.datetime;
		console.log(datetime);

		if (room) {
			$('.messages').empty().html(`
				<b>I have found a room for you!</b>
				<div class="card">
					<img src="/images/meeting.jpeg" alt="Avatar" style="width:100%">
					<div class="card-container">
						<h4><b>${room.name}</b></h4> 
						<p>${datetime? datetime.value : ''}</p> 
					</div>
				</div>
			`);
		} else {
			$('.messages').empty().html(`
				<b>I did not find any rooms. Sorry.</b>
			`);
		}
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
