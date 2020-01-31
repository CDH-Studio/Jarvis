'use strict';

const User = use('App/Models/User');
const UserRole = use('App/Models/UserRole');
const Env = use('Env');
const HttpsProxyAgent = require('https-proxy-agent');

// configure keycloak (OAuth agent)
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
		// leave empty
	},
	options: {
		authorizationMethod: 'body'
	}
};

// set proxy if keycloak proxy is needed from env file
if (Env.get('KEYCLOAK_proxy')) {
	keycloak.http['agent'] = new HttpsProxyAgent(Env.get('KEYCLOAK_proxy'));
}

// create OAuth agent
const oauth2 = require('simple-oauth2').create(keycloak);

const JWT = require('jsonwebtoken');

class AuthController {
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
	 * Convert code to token to authenticate user
	 * We return here after user logs in with AD
	 *
	 * If a user is already in our database we allow them through
	 * If a user is not found then they will have to make a profile.
	 *
	 *
	 */
	async authAD ({ request, session, response, auth, view }) {
		// getting authorization code
		const code = request.only(['code']).code;

		let userInfo, userAccess, userRole;

		// acquiring access token for user
		if (code) {
			try {
				let result = await oauth2.authorizationCode.getToken({
					code: code,
					redirect_uri: Env.get('KEYCLOAK_REDIRECT_URI'),
					scope: Env.get('KEYCLOAK_SCOPES')
				});
				const token = await oauth2.accessToken.create(result);

				// get user type from id_token
				userInfo = JWT.decode(token.token.id_token);

				// get user type from access_token
				userAccess = JWT.decode(token.token.access_token);

				// try to read admin role
				try {
					userRole = userAccess.resource_access.jarvis.roles[0];
				} catch (err) {
					userRole = 'user';
				}
			} catch (err) {
				console.log(err);
				return response.redirect('/');
			}
		}

		// get user email and search for user in database
		const email = userInfo.email;
		const user = await User
			.query()
			.where('email', email.toLowerCase())
			.first();

		// Set user role based on info from keycloak
		if (userRole === 'admin') {
			user.setUserRole('admin');
		} else {
			user.setUserRole('user');
		}

		// if user is found update role and login
		if (user) {
			// login user
			await auth.login(user);

			session.flash({
				notification: 'Welcome! You are logged in'
			});

			// redirect user
			if (auth.user.verified) {
				// If user details were found then redirect home
				session.flash({
					notification: 'Welcome! You are logged in'
				});
				return response.route('home');
			} else {
				// If user details were not found then redirect to profile form
				session.flash({
					notification: 'Please verify your information'
				});
				return response.redirect('/profile');
			}
		} else {
			// if user is not found then create the user and ask them to create a profile
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
		return response.redirect(`${Env.get('KEYCLOAK_HOST')}/auth/realms/individual/protocol/openid-connect/logout?redirect_uri=${Env.get('APP_URL')}/login`);
	}
}

module.exports = AuthController;
