'use strict';

/*
|--------------------------------------------------------------------------
| TEMP Ratings Seeder
|--------------------------------------------------------------------------
|
| Seed table with fake ratings for dev purposes
|
*/
const Reviews = use('App/Models/Review');

class TempIssuesSeeder {
	async run () {
		// generating fake use reports
		var ratingFiller = [
			{ 'user_id': 1, 'room_id': 1, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer' },
			{ 'user_id': 3, 'room_id': 13, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet' },
			{ 'user_id': 2, 'room_id': 29, 'rating': 1, 'review': 'Lorem ipsum' },
			{ 'user_id': 2, 'room_id': 18, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec' },
			{ 'user_id': 4, 'room_id': 7, 'rating': 2, 'review': 'Lorem' },
			{ 'user_id': 2, 'room_id': 13, 'rating': 2, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing' },
			{ 'user_id': 1, 'room_id': 6, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor.' },
			{ 'user_id': 4, 'room_id': 1, 'rating': 2, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer' },
			{ 'user_id': 4, 'room_id': 31, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus.' },
			{ 'user_id': 1, 'room_id': 42, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu' },
			{ 'user_id': 3, 'room_id': 12, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus.' },
			{ 'user_id': 3, 'room_id': 16, 'rating': 2, 'review': 'Lorem ipsum' },
			{ 'user_id': 4, 'room_id': 7, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur' },
			{ 'user_id': 4, 'room_id': 39, 'rating': 2, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed' },
			{ 'user_id': 1, 'room_id': 27, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus.' },
			{ 'user_id': 3, 'room_id': 34, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing' },
			{ 'user_id': 2, 'room_id': 10, 'rating': 1, 'review': 'Lorem ipsum dolor sit' },
			{ 'user_id': 3, 'room_id': 29, 'rating': 1, 'review': 'Lorem ipsum dolor' },
			{ 'user_id': 3, 'room_id': 16, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur' },
			{ 'user_id': 3, 'room_id': 13, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer' },
			{ 'user_id': 1, 'room_id': 29, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus.' },
			{ 'user_id': 1, 'room_id': 1, 'rating': 2, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut' },
			{ 'user_id': 4, 'room_id': 10, 'rating': 2, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus.' },
			{ 'user_id': 2, 'room_id': 33, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna' },
			{ 'user_id': 1, 'room_id': 30, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper.' },
			{ 'user_id': 3, 'room_id': 30, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu' },
			{ 'user_id': 1, 'room_id': 18, 'rating': 2, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed' },
			{ 'user_id': 4, 'room_id': 32, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur' },
			{ 'user_id': 3, 'room_id': 8, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut' },
			{ 'user_id': 3, 'room_id': 19, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet,' },
			{ 'user_id': 2, 'room_id': 4, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur' },
			{ 'user_id': 3, 'room_id': 18, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor.' },
			{ 'user_id': 1, 'room_id': 21, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut' },
			{ 'user_id': 2, 'room_id': 33, 'rating': 1, 'review': 'Lorem ipsum dolor' },
			{ 'user_id': 3, 'room_id': 4, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper.' },
			{ 'user_id': 2, 'room_id': 4, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam' },
			{ 'user_id': 4, 'room_id': 6, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at' },
			{ 'user_id': 2, 'room_id': 12, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis' },
			{ 'user_id': 2, 'room_id': 30, 'rating': 3, 'review': 'Lorem ipsum dolor sit' },
			{ 'user_id': 2, 'room_id': 21, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet,' },
			{ 'user_id': 1, 'room_id': 9, 'rating': 1, 'review': 'Lorem ipsum dolor' },
			{ 'user_id': 1, 'room_id': 27, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed' },
			{ 'user_id': 1, 'room_id': 4, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna' },
			{ 'user_id': 1, 'room_id': 7, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor.' },
			{ 'user_id': 3, 'room_id': 21, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed' },
			{ 'user_id': 2, 'room_id': 37, 'rating': 2, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing' },
			{ 'user_id': 3, 'room_id': 42, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus.' },
			{ 'user_id': 1, 'room_id': 27, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut' },
			{ 'user_id': 3, 'room_id': 44, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec' },
			{ 'user_id': 3, 'room_id': 44, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam' },
			{ 'user_id': 1, 'room_id': 5, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur' },
			{ 'user_id': 1, 'room_id': 9, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' },
			{ 'user_id': 1, 'room_id': 5, 'rating': 5, 'review': 'Lorem ipsum dolor' },
			{ 'user_id': 2, 'room_id': 10, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing' },
			{ 'user_id': 2, 'room_id': 40, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec' },
			{ 'user_id': 1, 'room_id': 41, 'rating': 2, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus.' },
			{ 'user_id': 2, 'room_id': 16, 'rating': 5, 'review': 'Lorem ipsum dolor' },
			{ 'user_id': 2, 'room_id': 30, 'rating': 2, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus.' },
			{ 'user_id': 1, 'room_id': 1, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus.' },
			{ 'user_id': 4, 'room_id': 44, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' },
			{ 'user_id': 1, 'room_id': 39, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam' },
			{ 'user_id': 1, 'room_id': 34, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at' },
			{ 'user_id': 4, 'room_id': 8, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet' },
			{ 'user_id': 3, 'room_id': 29, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus.' },
			{ 'user_id': 3, 'room_id': 20, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing' },
			{ 'user_id': 4, 'room_id': 4, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet' },
			{ 'user_id': 2, 'room_id': 35, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis' },
			{ 'user_id': 4, 'room_id': 17, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer' },
			{ 'user_id': 2, 'room_id': 9, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut' },
			{ 'user_id': 1, 'room_id': 34, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' },
			{ 'user_id': 3, 'room_id': 6, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis' },
			{ 'user_id': 4, 'room_id': 15, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam' },
			{ 'user_id': 2, 'room_id': 20, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam' },
			{ 'user_id': 3, 'room_id': 8, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer' },
			{ 'user_id': 1, 'room_id': 1, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at' },
			{ 'user_id': 3, 'room_id': 23, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer' },
			{ 'user_id': 1, 'room_id': 40, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet,' },
			{ 'user_id': 1, 'room_id': 9, 'rating': 4, 'review': 'Lorem ipsum dolor sit' },
			{ 'user_id': 1, 'room_id': 41, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis' },
			{ 'user_id': 3, 'room_id': 35, 'rating': 5, 'review': 'Lorem ipsum dolor sit' },
			{ 'user_id': 4, 'room_id': 26, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec' },
			{ 'user_id': 4, 'room_id': 31, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et' },
			{ 'user_id': 2, 'room_id': 3, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna' },
			{ 'user_id': 1, 'room_id': 10, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut' },
			{ 'user_id': 4, 'room_id': 4, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut' },
			{ 'user_id': 4, 'room_id': 27, 'rating': 2, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur' },
			{ 'user_id': 4, 'room_id': 15, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur' },
			{ 'user_id': 1, 'room_id': 3, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam' },
			{ 'user_id': 1, 'room_id': 26, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu' },
			{ 'user_id': 2, 'room_id': 15, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec' },
			{ 'user_id': 2, 'room_id': 12, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam' },
			{ 'user_id': 3, 'room_id': 24, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus.' },
			{ 'user_id': 2, 'room_id': 4, 'rating': 5, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus.' },
			{ 'user_id': 1, 'room_id': 21, 'rating': 4, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus.' },
			{ 'user_id': 4, 'room_id': 23, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor.' },
			{ 'user_id': 4, 'room_id': 1, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed' },
			{ 'user_id': 4, 'room_id': 14, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed' },
			{ 'user_id': 2, 'room_id': 4, 'rating': 3, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis' },
			{ 'user_id': 1, 'room_id': 12, 'rating': 2, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis' },
			{ 'user_id': 1, 'room_id': 10, 'rating': 1, 'review': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut' }
		];

		var count = await Reviews.getCount();

		if (count === 0) {
			for (var i = 0; i < ratingFiller.length; i++) {
				const review = new Reviews();
				review.user_id = ratingFiller[i].user_id;
				review.room_id = ratingFiller[i].room_id;
				review.rating = ratingFiller[i].rating;
				review.review = ratingFiller[i].review;
				await review.save();
			}
			console.log('Review DB: Finished Seeding');
		} else {
			console.log('Review DB: Already Seeded');
		}
	}
}

module.exports = TempIssuesSeeder;
