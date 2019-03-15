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
		let datetime = message.datetime.value;

		let date = '';
		let time = '';
		if (datetime) {
			const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			datetime = datetime.substring(0, datetime.length - 6);
			datetime = new Date(datetime);
			date = days[datetime.getDay()] + ', ' + months[datetime.getMonth()] + ' ' + datetime.getDate() + ', ' + datetime.getFullYear();
			time = datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		}

		if (room) {
			$('.messages').empty().html(`
				<b>I have found a room for you!</b>
				<div class="card">
					<img src="/images/meeting.jpeg" alt="Avatar" style="width:100%">
					<div class="card-container">
						<h4><b>${room.name}</b></h4> 
						<p>${date}</p> 
						<p>${time}</p> 
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
