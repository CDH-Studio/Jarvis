'use strict';
const Review = use('App/Models/Review');

class ReviewController {
	/**
	 * Adds a review Object into the Database.
	 *
	 * @param {Object} Context The context object.
	 */
	async add ({ request, response, session, auth, params }) {
		try {
			// Retrieves user input
			const body = request.all();

			// Populates the review object's values
			const review = new Review();
			review.user_id = auth.user.id;
			review.room_id = params.id;
			review.rating = body.rating;
			review.review = body.review;

			await review.save();
			session.flash({ notification: 'Review Added!' });

			return response.route('showRoom', { id: params.id });
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * Edits a review Object into the Database.
	 *
	 * @param {Object} Context The context object.
	 */
	async edit ({ request, response, session, auth, params }) {
		try {
			// Retrieves user input
			const body = request.all();

			// Update the review in the database
			await Review
				.query()
				.where('user_id', auth.user.id)
				.where('room_id', params.id)
				.update({
					rating: body.rating,
					review: body.review
				});

			session.flash({ notification: 'Review Updated!' });

			return response.route('showRoom', { id: params.id });
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * Deletes a review Object from the Database.
	 *
	 * @param {Object} Context The context object.
	 */
	async delete ({ request, response, session, auth, params }) {
		try {
			// retrives the reviews in the database
			let searchResults = await Review
				.query()
				.where('user_id', auth.user.id)
				.where('room_id', params.id)
				.fetch();

			const reviews = searchResults.toJSON();

			// stores the unique review id in reviewId
			const reviewId = reviews[0].id;

			// find the review object
			const review = await Review.findBy('id', reviewId);
			await review.delete();

			session.flash({ notification: 'Review Deleted!' });

			return response.route('showRoom', { id: params.id });
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = ReviewController;
