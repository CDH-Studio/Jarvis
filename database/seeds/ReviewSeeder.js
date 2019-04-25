'use strict';

/*
|--------------------------------------------------------------------------
| Review Seeder
|--------------------------------------------------------------------------
|
| Seed table with user accounts for dev purposes
|
*/
const Reviews = use('App/Models/Review');

class ReviewSeeder {
	async run () {
		var reviewFiller = [{ user_id: '2', room_id: '1', rating: '5', review: 'This room was beautiful!', reviewPicture: null },
			{ user_id: '2', room_id: '2', rating: '5', review: 'This room was just as described!', reviewPicture: null },
			{ user_id: '4', room_id: '1', rating: '3', review: 'This room was average.', reviewPicture: null },
			{ user_id: '4', room_id: '3', rating: '3', review: 'It was missing a chair, but overall it was fine.', reviewPicture: null },
			{ user_id: '6', room_id: '1', rating: '3', review: 'The projector was missing an HDMI cable but the room was nice.', reviewPicture: null },
			{ user_id: '6', room_id: '3', rating: '3', review: 'It was okay, but not enough sunlight.', reviewPicture: null },
			{ user_id: '8', room_id: '1', rating: '4', review: 'Very nice room, just missing a chair!', reviewPicture: null },
			{ user_id: '8', room_id: '4', rating: '2', review: 'This room was missing three pieces of equipment.', reviewPicture: null },
			{ user_id: '2', room_id: '3', rating: '2', review: 'This room was missing three every single piece of equipment.', reviewPicture: null },
			{ user_id: '4', room_id: '2', rating: '5', review: 'Amazing room!', reviewPicture: null },
			{ user_id: '6', room_id: '4', rating: '2', review: 'This room was missing a couple pieces of equipment.', reviewPicture: null },
			{ user_id: '8', room_id: '2', rating: '4', review: 'Perfect room.', reviewPicture: null }
		];

		var count = await Reviews.getCount();

		if (count === 0) {
			for (var i = 0; i < reviewFiller.length; i++) {
				const review = new Reviews();
				review.user_id = reviewFiller[i].user_id;
				review.room_id = reviewFiller[i].room_id;
				review.rating = reviewFiller[i].rating;
				review.review = reviewFiller[i].review;
				review.reviewPicture = reviewFiller[i].reviewPicture;
				await review.save();
			}
			console.log('Reviews DB: Finished Seeding');
		} else {
			console.log('Users Status DB: Already Seeded');
		}
	}
}

module.exports = ReviewSeeder;
