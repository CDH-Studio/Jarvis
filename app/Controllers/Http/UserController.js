'use strict';

const User = use('App/Models/User');
const Building = use('App/Models/Building');
const Tower = use('App/Models/Tower');
const Floor = use('App/Models/Floor');
const UserRole = use('App/Models/UserRole');
const AccountRequest = use('App/Models/AccountRequest');
const Hash = use('Hash');
const Env = use('Env');
const Logger = use('Logger');
const Outlook = new (use('App/Outlook'))();
// const ActiveDirectory = require('activedirectory');

/**
 * Generating a random string.
 *
 * @param {Integer} times Each time a string of 5 to 6 characters is generated.
 */
function randomString (times) {
	let result = '';
	for (let i = 0; i < times; i++) {
		result += Math.random().toString(36).substring(2);
	}

	return result;
}

/**
 * Update user password in the database
 *
 * @param {String} newPassword New password
 * @param {String} columnName  Name of the column to query by
 * @param {*} columnValue      Value of the column to query by
 */
async function updatePassword ({ newPassword, columnName, columnValue }) {
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
	async registerUserRender ({ request, auth, view, response }) {
		// present login to logged out users only
		if (auth.user) {
			return response.redirect('/');
		} else {
			const numb = Math.floor(Math.random() * 8) + 1;
			const photoName = 'login_' + numb + '.jpg';

			var formOptions = {};

			var buildingOptions = await Building.all();
			formOptions.buildings = buildingOptions.toJSON();

			var towerOptions = (await Tower.all()).toJSON();
			formOptions.towers = towerOptions;

			var floorOptions = (await Floor.all()).toJSON();
			formOptions.floors = floorOptions;

			return view.render('auth.registerUser', { photoName, formOptions });
		}
	}

	/**
	 * Create a new Enployee user. There is an option to verify the user directly
	 * or to make them verify their email address.
	 *
	 * @param {Object} Context The context object.
	 */
	async create ({ request, response, auth, session }) {
		const confirmationRequired = Env.get('REGISTRATION_CONFIRMATION', false);

		if (confirmationRequired) {
			return this.createWithVerifyingEmail({ request, response, session });
		} else {
			return this.createWithoutVerifyingEmail({ request, response, auth });
		}
	}

	/**
	 * Render a specific edit user page depending on the user Id.
	 *
	 * @param {Object} Context The context object.
	 */
	async edit ({ params, view, auth, response, request }) {
		try {
			// Retrieves user object
			const profile = await User.findOrFail(params.id);
			const profileRole = await profile.getUserRole();
			const userRole = await auth.user.getUserRole();
			let isAdmin, selectedBuilding, allBuildings;
			// check if admin is editing their own profile
			if (userRole === 'admin') {
				isAdmin = true;
				selectedBuilding = request.cookie('selectedBuilding');
				// get all builig info admin nav bar since this route is shared with regular users and admin
				// therefore, the admin middle-ware can't retrieve building info to pass to view
				allBuildings = await Building.all();
				allBuildings = allBuildings.toJSON();
				// check if user is editing their own profile
			} else if (auth.user.id === Number(params.id) && userRole === 'user') {
				isAdmin = false;
				// check if user is editing someone elses profile
			} else {
				return response.redirect('/');
			}

			let formOptions = {};

			if (profileRole === 'user') {
				var buildingOptions = await Building.all();
				formOptions.buildings = buildingOptions.toJSON();

				var towerOptions = await Tower.all();
				formOptions.towers = towerOptions.toJSON();

				var floorOptions = await Floor.all();
				formOptions.floors = floorOptions.toJSON();
			}

			return view.render('auth.editProfile', { user: profile,
				isAdmin,
				profileRole,
				formOptions,
				selectedBuilding,
				allBuildings });
		} catch (err) {
			Logger.debug(err);
			return response.route('home');
		}
	}

	/**
	 * Updates a user's information in the database.
	 *
	 * @param {Object} Context The context object.
	 */
	async update ({ auth, request, session, params, response }) {
		try {
			if (auth.user.id !== params.id && auth.user.getUserRole() === 'user') {
				return response.redirect('/');
			}

			// Retrieves user input
			const body = request.all();

			const profile = await User.findOrFail(params.id);
			const profileRole = await profile.getUserRole();

			// test if selected building, tower, and floor exist
			if (profileRole === 'user') {
				await Floor.findOrFail(body.floor);
				await Tower.findOrFail(body.tower);
				await Building.findOrFail(body.building);
			}
			// Updates user information in database
			await User
				.query()
				.where('id', params.id)
				.update({
					firstname: body.firstName,
					lastname: body.lastName,
					email_id: body.email,
					floor_id: body.floor,
					tower_id: body.tower,
					building_id: body.building
				});

			session.flash({ notification: 'Your profile has been updated!' });
		} catch (err) {
			Logger.debug(err);
		}

		return response.route('viewProfile', { id: params.id });
	}

	/**
	 * Create and verify a new Enployee user. Save them to the database and log them in.
	 *
	 * @param {Object} Context The context object.
	 */
	async createWithoutVerifyingEmail ({ request, response, auth }) {
		try {
			let body = request.post();

			// test if selected building, tower, and floor exist
			await Floor.findOrFail(body.floor);
			await Tower.findOrFail(body.tower);
			await Building.findOrFail(body.building);

			let userInfo = {};
			userInfo.firstname = body.firstname;
			userInfo.lastname = body.lastname;
			userInfo.password = body.password;
			userInfo.email = body.email.toLowerCase();
			userInfo.building_id = body.building;
			userInfo.tower_id = body.tower;
			userInfo.floor_id = body.floor;
			userInfo.role_id = await UserRole.getRoleID('user');
			userInfo.verified = true;

			const user = await User.create(userInfo);
			await auth.login(user);

			return response.redirect('/');
		} catch (err) {
			Logger.debug(err);
			return response.redirect('/register');
		}
	}
	/**
	 * Create a new Enployee user and send a confirmation email to them.
	 *
	 * @param {Object} Context The context object.
	 */
	async createWithVerifyingEmail ({ request, response, auth, session }) {
		try {
			let body = request.post();

			// test if selected building, tower, and floor exist
			await Floor.findOrFail(body.floor);
			await Tower.findOrFail(body.tower);
			await Building.findOrFail(body.building);

			let userInfo = {};
			userInfo.firstname = body.firstname;
			userInfo.lastname = body.lastname;
			userInfo.password = body.password;
			userInfo.email = body.email.toLowerCase();
			userInfo.building_id = body.building;
			userInfo.tower_id = body.tower;
			userInfo.floor_id = body.floor;
			userInfo.role_id = await UserRole.getRoleID('user');
			userInfo.verified = false;

			let hash = randomString(4);

			let row = {
				email: userInfo.email,
				hash: hash,
				type: 2
			};
			await AccountRequest.create(row);

			let mailBody = `
				<h2> Welcome to Jarvis, ${userInfo.firstname} </h2>
				<p>
					Please click on the following link or copy the URL into your browser: 
					${Env.get('SERVER_URL', 'https://jarvis-outlook-new-jarvis.apps.ic.gc.ca')}/newUser?hash=${hash}
				</p>
			`;

			await Outlook.sendMail({
				subject: 'Verify Email Address for Jarvis',
				body: mailBody,
				to: userInfo.email });

			await User.create(userInfo);

			session.flash({
				notification: 'A confirmation email with register instructions has been sent your email address.'
			});
			return response.redirect('/login');
		} catch (err) {
			Logger.debug(err);
			return response.redirect('/register');
		}
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
				return response.redirect('/userDash');
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

	async show ({ auth, params, view, response, request }) {
		let user = await User
			.query()
			.where('id', params.id)
			.with('floor')
			.with('tower')
			.with('building')
			.with('role')
			.firstOrFail();

		var canEdit = 0;
		const userRole = await auth.user.getUserRole();
		user = user.toJSON();

		let selectedBuilding, allBuildings;

		if (userRole === 'admin') {
			selectedBuilding = request.cookie('selectedBuilding');
			// get all builig info admin nav bar since this route is shared with regular users and admin
			// therefore, the admin middle-ware can't retrieve building info to pass to view
			allBuildings = await Building.all();
			allBuildings = allBuildings.toJSON();
		}

		// check if user is viewing their own profile or is admin
		if (auth.user.id === Number(params.id) || userRole === 'admin') {
			canEdit = 1;
		} else {
			return response.redirect('/');
		}

		return view.render('auth.showProfile', { auth, user, canEdit, allBuildings, selectedBuilding });
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
			let hash = randomString(4);

			let row = {
				email: email,
				hash: hash,
				type: 1
			};

			await AccountRequest.create(row);

			let body = `
      			<h2> Password Reset Request </h2>
      			<p>
        			We received a request to reset your password. If you asked to reset your password, please click on the following link: 
        			${Env.get('SERVER_URL', 'https://jarvis-outlook-new-jarvis.apps.ic.gc.ca')}/newPassword?hash=${hash}
      			</p>
			`;

			await Outlook.sendMail({
				subject: 'Password Reset Request',
				body: body,
				to: email });
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
				const numb = Math.floor(Math.random() * 8) + 1;
				const photoName = 'login_' + numb + '.jpg';

				return view.render('auth.resetPassword', { email, photoName });
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

		if (updatePassword({ newPassword, columnName: 'email', columnValue: email })) {
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
				if (updatePassword({ newPassword, columnName: 'id', columnValue: userId })) {
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
	async getAllUsers ({ view, request }) {
		const selectedBuilding = request.cookie('selectedBuilding');

		const results = await User.query().where('role_id', 2).where('building_id', selectedBuilding.id).fetch();
		const users = results.toJSON();

		// Sort the results by name
		users.sort((a, b) => {
			return (a.firstname > b.firstname) ? 1 : ((b.firstname > a.firstname) ? -1 : 0);
		});

		const pageTitle = 'All users';

		return view.render('adminPages.viewUsers', { users, pageTitle });
	}

	/**
	 * Query all admins from the database.
	 *
	 * @param {Object} Context The context object.
	 */
	async getAllAdmins ({ view, request }) {
		const pageTitle = 'All admin users';

		const results = await User.query().where('role_id', 1).fetch();
		const users = results.toJSON();

		// Sort the results by name
		users.sort((a, b) => {
			return (a.firstname > b.firstname) ? 1 : ((b.firstname > a.firstname) ? -1 : 0);
		});

		return view.render('adminPages.viewUsers', { users, pageTitle });
	}

	/**
	 * Active Directory
	 *
	 * @param {Object} Context The context object.
	 */
	async key ({ view }) {
		return view.render('auth.keycloak');
	}
}

module.exports = UserController;
