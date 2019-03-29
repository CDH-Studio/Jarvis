'use strict';

const User = use('App/Models/User');
const Tower = use('App/Models/Tower');
const Floor = use('App/Models/Floor');
const UserRole = use('App/Models/UserRole');
const AccountRequest = use('App/Models/AccountRequest');
const Mail = use('Mail');
const Hash = use('Hash');
const Env = use('Env');
const Logger = use('Logger');

/**
 * Generating a random string.
 *
 * @param {Integer} times Each time a string of 5 to 6 characters is generated.
 */
function random (times) {
	let result = '';
	for (let i = 0; i < times; i++) {
		result += Math.random().toString(36).substring(2);
	}

	return result;
}

/**
 * Send an email.
 *
 * @param {string} subject  Subject of Email
 * @param {string} body     Body of Email
 * @param {string} to       Sending address
 * @param {string} from     Receiving address
 */
function sendMail (subject, body, to, from) {
	Mail.raw(body, (message) => {
		message
			.to(to)
			.from(from)
			.subject(subject);
	});
	Logger.info('mail sent');
}

/**
 * Update user password in the database
 *
 * @param {String} newPassword New password
 * @param {String} columnName  Name of the column to query by
 * @param {*} columnValue      Value of the column to query by
 */
async function updatePassword (newPassword, columnName, columnValue) {
	try {
		const hashedNewPassword = await Hash.make(newPassword);
		const changedRow = await User
			.query()
			.where(columnName, columnValue)
			.update({ password: hashedNewPassword });

		return changedRow;
	} catch (err) {
		Logger.debug(err);
	}
}

class UserController {
	/**
	 * Render Register page
	 *
	 * @param {Object} Context The context object.
	 */
	async registerRender ({ request, auth, view, response }) {
		// present login to logged out users only
		if (auth.user) {
			return response.redirect('/');
		} else {
			const numb = Math.floor(Math.random() * 8) + 1;
			const photoName = 'login_' + numb + '.jpg';

			var towerOptions = await Tower.all();
			towerOptions = towerOptions.toJSON();

			var floorOptions = await Floor.all();
			floorOptions = floorOptions.toJSON();

			return view.render('auth.register', { photoName, floorOptions, towerOptions });
		}
	}

	/**
	 * Create a new Enployee user. There is an option to verify the user directly
	 * or to make them verify their email address.
	 *
	 * @param {Object} Context The context object.
	 */
	async create ({ request, response, auth }) {
		const confirmationRequired = Env.get('REGISTRATION_CONFIRMATION', false);

		if (confirmationRequired) {
			return this.createWithVerifyingEmail({ request, response });
		} else {
			return this.createWithoutVerifyingEmail({ request, response, auth });
		}
	}

	/**
	 * Render a specific edit user page depending on the user Id.
	 *
	 * @param {Object} Context The context object.
	 */
	async edit ({ params, view, auth, response }) {
		// Retrieves user object
		const user = await User.findBy('id', params.id);
		var layoutType = '';
		const userRole = await auth.user.getUserRole();
		var isAdmin;

		// check if admin is editing their own profile
		if (userRole === 'admin') {
			isAdmin = true;
		// check if user is editing their own profile
		} else if (auth.user.id === Number(params.id) && userRole === 'user') {
			isAdmin = false;
		// check if user is editing someone elses profile
		} else {
			return response.redirect('/');
		}

		return view.render('auth.editUser', { user: user, layoutType: layoutType, isAdmin: isAdmin });
	}

	/**
	 * Updates a user's information in the database.
	 *
	 * @param {Object} Context The context object.
	 */
	async update ({ request, session, params, response }) {
		// Retrieves user input
		const body = request.all();

		// Updates user information in database
		await User
			.query()
			.where('id', params.id)
			.update({
				firstname: body.firstName,
				lastname: body.lastName,
				email: body.email,
				floor: body.floor,
				tower: body.tower
			});

		session.flash({ notification: 'Your profile has been updated!' });

		return response.route('viewProfile', { id: params.id });
	}

	/**
	 * Create and verify a new Enployee user. Save them to the database and log them in.
	 *
	 * @param {Object} Context The context object.
	 */
	async createWithoutVerifyingEmail ({ request, response, auth }) {
		var userInfo = request.only(['firstname', 'lastname', 'email', 'password', 'tower', 'floor']);
		userInfo.role_id = await UserRole.getRoleID('user');
		userInfo.verified = true;
		userInfo.email = userInfo.email.toLowerCase();
		const user = await User.create(userInfo);

		await auth.login(user);
		return response.redirect('/');
	}

	/**
	 * Create a new Enployee user and send a confirmation email to them.
	 *
	 * @param {Object} Context The context object.
	 */
	async createWithVerifyingEmail ({ request, response, auth }) {
		var userInfo = request.only(['firstname', 'lastname', 'email', 'password', 'tower', 'floor']);
		userInfo.role_id = await UserRole.getRoleID('user');
		userInfo.verified = false;

		let hash = random(4);

		let row = {
			email: userInfo.email,
			hash: hash,
			type: 2
		};
		await AccountRequest.create(row);

		let body = `
			<h2> Welcome to Jarvis, ${userInfo.firstname} </h2>
    		<p>
      			Please click the following URL into your browser: 
      			http://localhost:3333/newUser?hash=${hash}
    		</p>
    	`;

		await sendMail('Verify Email Address for Jarvis',
			body, userInfo.email, 'support@mail.cdhstudio.ca');

		await User.create(userInfo);
		return response.redirect('/login');
	}

	/**
	 * Verify the user's emaill address.
	 *
	 * @param {Object} Context The context object.
	 */
	async verifyEmail ({ request, response }) {
		const hash = request._all.hash;

		try {
			let results = await AccountRequest
				.query()
				.where('hash', '=', hash)
				.fetch();
			let rows = results.toJSON();
			Logger.debug(rows);
			const email = rows[0].email;

			await User
				.query()
				.where('email', email)
				.update({ verified: true });

			return response.redirect('/');
		} catch (err) {
			Logger.debug(err);
		}
	}

	/**
	 * Render Register page
	 *
	 * @param {Object} Context The context object.
	 */
	async registerAdminRender ({ request, auth, view, response }) {
		// present login to logged out users only
		if (auth.user) {
			return response.redirect('/');
		} else {
			return view.render('auth.registerAdmin');
		}
	}

	/**
	 * Create and verify a new Admin user. Save them to the database and log them in.
	 *
	 * @param {Object} Context The context object.
	 */
	async createAdmin ({ request, response, auth }) {
		var adminInfo = request.only(['firstname', 'lastname', 'email'.toLowerCase(), 'password']);
		adminInfo.role_id = await UserRole.getRoleID('admin');
		adminInfo['verified'] = 1;
		adminInfo.email = adminInfo.email.toLowerCase();
		const user = await User.create(adminInfo);
		await auth.login(user);
		return response.redirect('/');
	}

	/**
	 * Render login page
	 *
	 * @param {Object} Context The context object.
	 */
	async loginRender ({ request, auth, view, response }) {
		// present login to logged out users only
		if (auth.user) {
			return response.redirect('/');
		} else {
			var numb = Math.floor(Math.random() * 8) + 1;
			var photoName = 'login_' + numb + '.jpg';
			return view.render('auth.login', { photoName });
		}
	}

	/**
	 * Log a user in and redirect them to their respective landing page depending on the user type.
	 *
	 * @param {Object} Context The context object.
	 */
	async login ({ request, auth, response, session }) {
		const { email, password } = request.all();

		const user = await User
			.query()
			.where('email', email.toLowerCase())
			.where('verified', true)
			.first();

		try {
			await auth.attempt(user.email, password);
			if (auth.user.getUserRole() === 'User') {
				session.flash({
					notification: 'Welcome! You are logged in'
				});
				return response.redirect('/booking');
			} else {
				return response.redirect('/');
			}
		} catch (error) {
			session.flash({ loginError: 'Invalid email/password' });
			return response.redirect('/login');
		}
	}

	/**
	 * Render login page
	 *
	 * @param {Object} Context The context object.
	 */
	async forgotPasswordRender ({ request, auth, view, response }) {
		// present login to logged out users only
		if (auth.user) {
			return response.redirect('/');
		} else {
			var numb = Math.floor(Math.random() * 8) + 1;
			var photoName = 'login_' + numb + '.jpg';
			return view.render('auth.forgotPassword', { photoName });
		}
	}

	/**
	 * Log a user out.
	 *
	 * @param {Object} Context The context object.
	 */
	async logout ({ auth, response, session }) {
		await auth.logout();
		session.flash({
			notification: 'You have been logged out.'
		});
		return response.redirect('/login');
	}

	async show ({ auth, params, view, response }) {
		const user = await User.find(Number(params.id));
		var canEdit = 0;
		var layoutType = '';
		const userRole = await auth.user.getUserRole();
		const profileUserRole = await user.getUserRole();
		// check if admin is viewing their own profile

		// check if user is viewing their own profile or is admin
		if (auth.user.id === Number(params.id) || userRole === 'admin') {
			canEdit = 1;
		} else {
			return response.redirect('/');
		}

		return view.render('auth.showUser', { auth, user, layoutType, canEdit, profileUserRole });
	}

	/**
	 * Create a password reset request record in the database and send a confirmation email to the user.
	 *
	 * @param {Object} Context The context object.
	 */
	async createPasswordResetRequest ({ request, response, session }) {
		const email = request.body.email;
		const results = await User
			.query()
			.where('email', '=', email)
			.fetch();
		const rows = results.toJSON();

		if (rows.length !== 0) {
			let hash = random(4);

			let row = {
				email: email,
				hash: hash,
				type: 1
			};

			await AccountRequest.create(row);

			let body = `
      			<h2> Password Reset Request </h2>
      			<p>
        			We received a request to reset your password. If you asked to reset your password, please click the following URL: 
        			http://localhost:3333/newPassword?hash=${hash}
      			</p>
			`;

			await sendMail('Password Reset Request',
				body, email, 'support@mail.cdhstudio.ca');
		}

		session.flash({
			notification: `An email has been sent to ${email} with further instructions on how to reset your password.`
		});

		return response.redirect('/login');
	}

	/**
	 * Verify the user's password reset hash code and redirect them to the password reset page.
	 *
	 * @param {Object} Context The context object.
	 */
	async verifyHash ({ request, view }) {
		const hash = request._all.hash;
		if (hash) {
			const results = await AccountRequest
				.query()
				.where('hash', '=', hash)
				.fetch();
			const rows = results.toJSON();
			Logger.debug(hash);

			if (rows.length !== 0 && rows[0].type === 1) {
				const email = rows[0].email;

				return view.render('resetPassword', { email });
			}
		}
	}

	/**
	 * Update the user's password in the database.
	 *
	 * @param {Object} Context The context object.
	 */
	async resetPassword ({ request, response, session }) {
		const { newPassword, email } = request.only(['newPassword', 'email']);

		if (updatePassword(newPassword, 'email', email)) {
			session.flash({
				notification: 'Your password has been changed. Please use the new password to log in.'
			});
			return response.redirect('/login');
		}
	}

	/**
	 * Update the user's password in the database.
	 *
	 * @param {Object} Context The context object.
	 */
	async changePassword ({ request, response, auth, session }) {
		const { newPassword, userId } = request.only(['newPassword', 'userId']);
		const userRole = await auth.user.getUserRole();
		if (userRole === 'admin' || (auth.user.id === Number(userId) && userRole === 'user')) {
			try {
				if (updatePassword(newPassword, 'id', userId)) {
					session.flash({ success: 'Password Updated Successfully' });
				}
			} catch (error) {
				session.flash({ error: 'Password Update failed' });
				return response.redirect('/login');
			}

			return response.route('viewProfile', { id: Number(userId) });
			// check if user is viewing their own profile
		} else {
			return response.redirect('/');
		}
	}

	/**
	 * Query all the users from the database.
	 *
	 * @param {Object} Context The context object.
	 */
	async getAllUsers ({ view }) {
		const results = await User.all();
		const users = results.toJSON();

		// Sort the results by name
		users.sort((a, b) => {
			return (a.firstname > b.firstname) ? 1 : ((b.firstname > a.firstname) ? -1 : 0);
		});

		return view.render('adminDash.viewUsers', { users });
	}
}

module.exports = UserController;
