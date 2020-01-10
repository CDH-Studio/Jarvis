'use strict';

const User = use('App/Models/User');
const Building = use('App/Models/Building');
const Tower = use('App/Models/Tower');
const Floor = use('App/Models/Floor');
const UserRole = use('App/Models/UserRole');
const Env = use('Env');
const Logger = use('Logger');
const moment = require('moment');
const HttpsProxyAgent = require('https-proxy-agent');

//configure keycloak (OAuth agent)
var keycloak = {
	client: {
		id: Env.get('KEYCLOAK_CLIENT_ID'),
		secret: Env.get('KEYCLOAK_CLIENT_SECRET')
	},
	auth: {
		tokenHost: Env.get('KEYCLOAK_HOST'),
		tokenPath: Env.get('KEYCLOAK_TOKEN_ENDPOINT'),
		authorizePath: Env.get('KEYCLOAK_AUTH_ENDPOINT')
	},
	http: {
        //leave empty
	},
	options:{
		authorizationMethod: "body"
	}
}

// set proxy if keycloak proxy is needed from env file
if(Env.get('KEYCLOAK_proxy')){
	keycloak.http['agent']=new HttpsProxyAgent(Env.get('KEYCLOAK_proxy'));
}

// create OAuth agent
const oauth2 = require('simple-oauth2').create(keycloak);

const JWT = require('jsonwebtoken');

class UserController {
	/**
	 * Render Profile Creation page
	 *
	 * @param {Object} Context The context object.
	 */
	async createProfileRender ({ view, auth }) {
		const numb = Math.floor(Math.random() * 8) + 1;
		const photoName = 'login_' + numb + '.jpg';

		var formOptions = {};

		var buildingOptions = await Building.all();
		formOptions.buildings = buildingOptions.toJSON();

		var towerOptions = (await Tower.all()).toJSON();
		formOptions.towers = towerOptions;

		var floorOptions = (await Floor.all()).toJSON();
		formOptions.floors = floorOptions;

		return view.render('auth.createProfile', { photoName, formOptions, userInfo: auth.user });
	}

	/**
	 * Create a profile for user.
	 *
	 * @param {Object} Context The context object.
	 */
	async createProfile ({ request, response, auth }) {
		try {
			let body = request.post();

			// test if selected building, tower, and floor exist
			await Floor.findOrFail(body.floor);
			await Tower.findOrFail(body.tower);
			await Building.findOrFail(body.building);

			auth.user.verified = true;
			auth.user.building_id = body.building;
			auth.user.tower_id = body.tower;
			auth.user.floor_id = body.floor;

			await auth.user.save();

			return response.redirect('/');
		} catch (err) {
			Logger.debug(err);
			return response.redirect('/profile');
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
	 * Log a user in and redirect them to their respective landing page depending on the user type.
	 *
	 * @param {Object} Context The context object.
	 */
	async login ({ request, auth, response, session }) {
		const { email } = request.all();
		const user = await User
			.query()
			.where('email', email.toLowerCase())
			.where('verified', true)
			.first();

		try {
			await auth.login(user);
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
	 * Log a user out.
	 *
	 * @param {Object} Context The context object.
	 */
	async logout ({ auth, response, session }) {
		await auth.logout();

		session.flash({
			notification: 'You have been logged out.'
		});
		return response.redirect(`${Env.get('KEYCLOAK_HOST')}/auth/realms/individual/protocol/openid-connect/logout?redirect_uri=${Env.get('SERVER_URL')}/login`);
	}

	async show ({ auth, params, view, response, request, session }) {
		try {
			// find user
			let user = await User
				.query()
				.where('id', params.id)
				.with('floor')
				.with('tower')
				.with('building')
				.with('role')
				.withCount('bookings')
				.withCount('reports')
				.withCount('reviews')
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
		} catch (error) {
			return response.route('home');
		}
	}

	async delete ({ auth, params, response }) {
		try {
			const userRole = await auth.user.getUserRole();

			if (userRole === 'admin' || auth.user.id === Number(params.id)) {
				// find user
				let user = await User
					.query()
					.where('id', params.id)
					.withCount('bookings')
					.withCount('reports')
					.withCount('reviews')
					.firstOrFail();

				let userJSON = user.toJSON();

				// check if user has bookings, reviews, or reported issues
				if (!userJSON.__meta__.bookings_count && !userJSON.__meta__.reports_count && !userJSON.__meta__.reviews_count) {
					await user.delete();
				}
			}
			return response.redirect(`${Env.get('KEYCLOAK_HOST')}/auth/realms/individual/protocol/openid-connect/logout?redirect_uri=${Env.get('SERVER_URL')}/login`);
		} catch (error) {
			return response.route('home');
		}
	}

	/**
	 * Query all the users from the database.
	 *
	 * @param {Object} Context The context object.
	 */
	async getAllUsers ({ view, request }) {
		const selectedBuilding = request.cookie('selectedBuilding');

		const results = await User.query()
			.where('role_id', 2)
			.where('building_id', selectedBuilding.id)
			.withCount('bookings')
			.with('bookings')
			.fetch();
		const users = results.toJSON();

		// look for the most recent booking of each user
		users.forEach(user => {
			user.lastBooking = '';

			if (user.bookings.length !== 0) {
				const bookings = user.bookings.filter(booking => {
					return booking.from !== null;
				});

				const last = bookings.reduce((prev, cur) => {
					return cur.from > prev.from ? cur : prev;
				});

				user.lastBooking = moment(last.from).format('YYYY-MM-DD');
			}
		});

		// Sort the results by name
		users.sort((a, b) => {
			return (a.firstname > b.firstname) ? 1 : ((b.firstname > a.firstname) ? -1 : 0);
		});

		const pageTitle = 'All users';

		return view.render('adminPages.viewUsers', { users, pageTitle, moment });
	}

	/**
	 * Query all admins from the database.
	 *
	 * @param {Object} Context The context object.
	 */
	async getAllAdmins ({ view, request }) {
		const pageTitle = 'All admin users';

		const results = await User.query()
			.where('role_id', 1)
			.withCount('bookings')
			.with('bookings')
			.fetch();
		const users = results.toJSON();

		// look for the most recent booking of each user
		users.forEach(user => {
			user.lastBooking = '';

			if (user.bookings.length !== 0) {
				const bookings = user.bookings.filter(booking => {
					return booking.from !== null;
				});

				const last = bookings.reduce((prev, cur) => {
					return cur.from > prev.from ? cur : prev;
				});

				user.lastBooking = moment(last.from).format('YYYY-MM-DD');
			}
		});

		return view.render('adminPages.viewUsers', { users, pageTitle, moment });
	}

	/**
	 * Redirect to Active Directory login form login screen
	 *
	 */
	async loginAD ({ response }) {
		const authUri = oauth2.authorizationCode.authorizeURL({
			redirect_uri: Env.get('KEYCLOAK_REDIRECT_URI'),
			scope: Env.get('KEYCLOAK_SCOPES')
		});

		return response.redirect(authUri);
	}

	/**
	 * Render login page
	 *
	 */
	async loginRender ({ auth, view, response }) {
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
	 * Convert code to token to authenticate user
	 * We return here after user logs in with AD
	 */
	async authAD ({ request, session, response, auth, view }) {
		// getting authorization code
		const code = request.only(['code']).code;

		// acquiring access token for user
		let userInfo;
		if (code) {
			try {
				let result = await oauth2.authorizationCode.getToken({
					code: code,
					redirect_uri: Env.get('KEYCLOAK_REDIRECT_URI'),
					scope: Env.get('KEYCLOAK_SCOPES')
				});
				const token = await oauth2.accessToken.create(result);

				userInfo = JWT.decode(token.token.id_token);
			} catch (err) {
				console.log(err)
				return err;
			}
		}

		const email = userInfo.email;
		const user = await User
			.query()
			.where('email', email.toLowerCase())
			.first();

		if (user) {
			await auth.login(user);
			if (auth.user.role_id === 2) {
				if (auth.user.verified) {
					session.flash({
						notification: 'Welcome! You are logged in'
					});

					return response.redirect('/userDash');
				} else {
					return response.redirect('/profile');
				}
			} else {
				return response.redirect('/');
			}
		} else {
			let newUser = {};
			newUser.firstname = userInfo.given_name;
			newUser.lastname = userInfo.family_name;
			newUser.email = userInfo.email.toLowerCase();
			newUser.role_id = await UserRole.getRoleID('user');
			newUser.verified = false;
			newUser.building_id = '1';
			newUser.tower_id = '1';
			newUser.floor_id = '1';

			const user = await User.create(newUser);
			await auth.login(user);
			return response.redirect('/profile');
		}
	}

	async test ({ params, auth, response }) {
		const email = params.id;

		try {
			const user = await User
				.query()
				.where('email', email.toLowerCase())
				.where('verified', true)
				.first();

			auth.login(user);

			response.redirect('/');
		} catch (e) {
			response.redirect('/');
		}
	}
}

module.exports = UserController;
