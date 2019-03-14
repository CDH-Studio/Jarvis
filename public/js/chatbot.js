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
			$('.messages').html(`
				<div class="card">
					<img src="/images/meeting.jpeg" alt="Avatar" style="width:100%">
					<div class="card-container">
						<h4><b>${room.name}</b></h4> 
						<p></p> 
					</div>
				</div>
			`);
		}

		// $('.messages').append(`
		// 	<div>
		// 	@!component('components.card',
		// 	id=${room.id},
		// 	title=${room.name},
		// 	fullName=${room.fullName},
		// 	phoneNumber=${room.telephone},
		// 	seats=${room.seats},
		// 	maxCapacity=${room.capacity},
		// 	floor=${room.floor},
		// 	tower=${room.tower},
		// 	projector=${room.projector},
		// 	flipChart=${room.flipchart},
		// 	whiteBoard=${room.whiteboard},
		// 	audioConference=${room.audioConference},
		// 	videoConference=${room.videoConference},
		// 	pc=${room.pc},
		// 	surfaceHub=${room.surfaceHub},
		// 	extraEquipment=${room.extraEquipment},
		// 	comment=${room.comment})
		// 	</div>
		// `);
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
