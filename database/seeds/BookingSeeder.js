'use strict';

/*
|--------------------------------------------------------------------------
| Booking Seeder
|--------------------------------------------------------------------------
|
| Seed table with user accounts for dev purposes
|
*/
const Bookings = use('App/Models/Booking');

class BookingSeeder {
	async run () {
		var bookingFiller = [{ user_id: '2', room_id: '1', event_id: '', subject: 'Meeting 1', from: '2019-04-17T15:30:00.0000000', to: '2019-04-17T16:30:00.0000000', status: 'Approved' },
			{ user_id: '2', room_id: '2', event_id: '', subject: 'Meeting 2', from: '2019-04-17T15:30:00.0000000', to: '2019-04-17T16:30:00.0000000', status: 'Approved' },
			{ user_id: '2', room_id: '2', event_id: '', subject: 'Meeting 2', from: '2019-03-17T15:30:00.0000000', to: '2019-03-17T16:30:00.0000000', status: 'Approved' },
			{ user_id: '2', room_id: '2', event_id: '', subject: 'Meeting 2', from: '2019-03-17T16:30:00.0000000', to: '2019-03-17T17:30:00.0000000', status: 'Approved' },
			{ user_id: '2', room_id: '2', event_id: '', subject: 'Meeting 2', from: '2019-03-17T18:30:00.0000000', to: '2019-03-17T19:30:00.0000000', status: 'Approved' },
			{ user_id: '4', room_id: '3', event_id: '', subject: 'Meeting 3', from: '2019-04-17T15:30:00.0000000', to: '2019-04-17T16:30:00.0000000', status: 'Approved' },
			{ user_id: '4', room_id: '4', event_id: '', subject: 'Meeting 4', from: '2019-04-17T15:30:00.0000000', to: '2019-04-17T16:30:00.0000000', status: 'Approved' },
			{ user_id: '4', room_id: '4', event_id: '', subject: 'Meeting 4', from: '2019-02-17T16:30:00.0000000', to: '2019-02-17T17:30:00.0000000', status: 'Approved' },
			{ user_id: '4', room_id: '4', event_id: '', subject: 'Meeting 4', from: '2019-02-17T18:30:00.0000000', to: '2019-02-17T19:30:00.0000000', status: 'Approved' },
			{ user_id: '4', room_id: '4', event_id: '', subject: 'Meeting 4', from: '2019-02-17T20:30:00.0000000', to: '2019-02-17T21:30:00.0000000', status: 'Approved' },
			{ user_id: '6', room_id: '5', event_id: '', subject: 'Meeting 5', from: '2019-04-17T15:30:00.0000000', to: '2019-04-17T16:30:00.0000000', status: 'Approved' },
			{ user_id: '6', room_id: '6', event_id: '', subject: 'Meeting 6', from: '2019-04-17T15:30:00.0000000', to: '2019-04-17T16:30:00.0000000', status: 'Approved' },
			{ user_id: '6', room_id: '6', event_id: '', subject: 'Meeting 6', from: '2019-01-17T15:30:00.0000000', to: '2019-01-17T16:30:00.0000000', status: 'Approved' },
			{ user_id: '6', room_id: '6', event_id: '', subject: 'Meeting 6', from: '2019-01-18T15:30:00.0000000', to: '2019-01-18T16:30:00.0000000', status: 'Approved' },
			{ user_id: '6', room_id: '6', event_id: '', subject: 'Meeting 6', from: '2019-02-18T19:30:00.0000000', to: '2019-02-18T20:30:00.0000000', status: 'Approved' },
			{ user_id: '8', room_id: '7', event_id: '', subject: 'Meeting 7', from: '2019-04-17T15:30:00.0000000', to: '2019-04-17T16:30:00.0000000', status: 'Approved' },
			{ user_id: '8', room_id: '8', event_id: '', subject: 'Meeting 8', from: '2019-04-17T15:30:00.0000000', to: '2019-04-17T16:30:00.0000000', status: 'Approved' },
			{ user_id: '8', room_id: '8', event_id: '', subject: 'Meeting 8', from: '2018-12-17T15:30:00.0000000', to: '2018-12-17T16:30:00.0000000', status: 'Approved' },
			{ user_id: '8', room_id: '1', event_id: '', subject: 'Meeting 8', from: '2018-12-18T15:30:00.0000000', to: '2018-12-18T16:30:00.0000000', status: 'Approved' },
			{ user_id: '8', room_id: '2', event_id: '', subject: 'Meeting 8', from: '2018-11-18T15:30:00.0000000', to: '2018-11-18T16:30:00.0000000', status: 'Approved' }
		];

		var count = await Bookings.getCount();

		if (count === 0) {
			for (var i = 0; i < bookingFiller.length; i++) {
				const booking = new Bookings();
				booking.user_id = bookingFiller[i].user_id;
				booking.room_id = bookingFiller[i].room_id;
				booking.event_id = bookingFiller[i].event_id;
				booking.subject = bookingFiller[i].subject;
				booking.from = bookingFiller[i].from;
				booking.to = bookingFiller[i].to;
				booking.status = bookingFiller[i].status;
				await booking.save();
			}
			console.log('Bookings DB: Finished Seeding');
		} else {
			console.log('Users Status DB: Already Seeded');
		}
	}
}

module.exports = BookingSeeder;
