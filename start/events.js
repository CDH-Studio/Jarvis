const Event = use('Event');
const Pusher = require('pusher');
const Env = use('Env');

let pusher = new Pusher({
	appId: Env.get('PUSHER_APP_ID', ''),
	key: Env.get('PUSHER_KEY', ''),
	secret: Env.get('PUSHER_SECRET', ''),
	cluster: Env.get('PUSHER_CLUSTER'),
	useTLS: true
});

Event.when('send.room', async (message) => {
	pusher.trigger('adonis-channel', 'send-room', {
		message
	});
});

Event.when('send.hasResults', async (message) => {
	pusher.trigger('adonis-channel', 'send-hasResults', {
		message
	});
});

Event.when('send.empty', async (message) => {
	pusher.trigger('adonis-channel', 'send-empty', {
		message
	});
});
