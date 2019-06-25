'use strict';

const Scheduler = use('Scheduler');
const ENV = use('Env');

if (ENV.get('DEV_OUTLOOK', 'prod') !== 'prod') {
	Scheduler.run();
}
