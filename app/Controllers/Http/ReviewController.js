'use strict';
const Review = use('App/Models/Review');
const Room = use('App/Models/Room');
const Helpers = use('Helpers');
const Drive = use('Drive');

class ReviewController {
	/**
	 * Adds a review Object into the Database.
	 *
	 * @param {Object} Context The context object.
	 */
	async add ({ request, response, session, auth, params }) {
		try {
			// Check if room exists
			const room = await Room.findOrFail(params.id);

			// Retrieves user input
			const body = request.all();

			// Populates the review object's values
			const review = new Review();
			review.user_id = auth.user.id;
			review.room_id = room.id;
			review.rating = body.rating;
			review.review = body.review;

			// Upload process - Review Picture
			const reviewPicture = request.file('reviewPicture', {
				types: ['image'],
				size: '2mb'
			});

			// set the value of the reviewPicture depending on wether it is null or not
			if (reviewPicture == null) {
				review.reviewPicture = null;
			} else {
				await reviewPicture.move(Helpers.publicPath('uploads/reviewPictures/'), {
					name: `${params.id}_${auth.user.id}_reviewPicture.png`
				});

				// Populates the review object's values
				review.reviewPicture = `uploads/reviewPictures/${params.id}_${auth.user.id}_reviewPicture.png`;
			}

			await review.save();

			// Update Room Average
			const reviews = await Review.query().where('room_id', room.id).avg('rating as avgRating').first();
			room.avg_rating = reviews.avgRating;
			await room.save();

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
			// Check if room exists
			const room = await Room.findOrFail(params.id);
			// Retrieves user input
			const body = request.all();

			// Upload process - Review Picture
			const reviewPicture = request.file('reviewPicture', {
				types: ['image'],
				size: '2mb'
			});

			// sets the value of the reviewPicture depending on wether it is null or not
			var reviewPictureString;

			if (reviewPicture == null) {
				// if its null, set the value of reviewPicture to null and delete the current picture from the file system
				reviewPictureString = null;

				// retrives the reviews in the database
				let searchResults = await Review
					.query()
					.where('user_id', auth.user.id)
					.where('room_id', room.id)
					.fetch();

				const reviews = searchResults.toJSON();

				// stores the unique review id in reviewId
				const reviewId = reviews[0].id;

				// find the review object
				const review = await Review.findBy('id', reviewId);
				if (review.reviewPicture != null) {
					await Drive.delete(review.reviewPicture);
				}
			} else {
				await reviewPicture.move(Helpers.publicPath('uploads/reviewPictures/'), {
					name: `${params.id}_${auth.user.id}_reviewPicture.png`,
					overwrite: true
				});

				// Populates the review object's values
				reviewPictureString = `uploads/reviewPictures/${room.id}_${auth.user.id}_reviewPicture.png`;
			}

			// Update the review in the database
			await Review
				.query()
				.where('user_id', auth.user.id)
				.where('room_id', params.id)
				.update({
					rating: body.rating,
					review: body.review,
					reviewPicture: reviewPictureString
				});

			// update average room rating
			const reviews = await Review.query().where('room_id', room.id).avg('rating as avgRating').first();
			room.avg_rating = reviews.avgRating;
			await room.save();

			session.flash({ notification: 'Review Updated!' });

			return response.route('showRoom', { id: room.id });
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
			const userRole = await auth.user.getUserRole();

			// Retrieves user input
			const body = request.all();

			// Check if room exists
			const room = await Room.findOrFail(params.id);

			let searchResults;

			if (userRole === 'admin') {
				searchResults = await Review.findOrFail(body.reviewID);
			} else {
				// retrieves the reviews in the database
				searchResults = await Review
					.query()
					.where('user_id', auth.user.id)
					.where('room_id', room.id)
					.firstOrFail();
			}

			const review = searchResults.toJSON();

			if (review.reviewPicture != null) {
				// deletes the review picture in the file system
				await Drive.delete(review.reviewPicture);
			}

			// deletes the review object
			await searchResults.delete();

			// update average room rating
			let roomRating = await Review.query().where('room_id', room.id).avg('rating as avgRating').first();
			if (roomRating.avgRating != null) {
				room.avg_rating = roomRating.avgRating;
			} else {
				room.avg_rating = 0;
			}
			await room.save();

			session.flash({ notification: 'Review Deleted!' });

			return response.route('showRoom', { id: params.id });
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = ReviewController;
