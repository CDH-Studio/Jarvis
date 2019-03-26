'use strict';
const Env = use('Env');
const Token = use('App/Models/Token');
const JWT = require('jsonwebtoken');
const Event = use('Event');

// The credentials for Microsoft Graph
const credentials = {
	client: {
		id: Env.get('MICROSOFT_APP_ID'),
		secret: Env.get('MICROSOFT_APP_PASSWORD')
	},

	auth: {
		tokenHost: Env.get('MICROSOFT_HOST'),
		authorizePath: Env.get('MICROSOFT_AUTHORIZE_ENDPOINT'),
		tokenPath: Env.get('MICROSOFT_TOKEN_ENDPOINT')
	}
};
const Oauth2 = require('simple-oauth2').create(credentials);

/**
 * Update the tokens in the database
 *
 * @param {*} token The tokens received from Graph (access token, refresh token and account information).
 */
async function saveToDatabase (token) {
	await Token.truncate();
	const accessTokenModel = new Token();
	accessTokenModel.token = token.token.access_token;
	accessTokenModel.type = 'access';
	accessTokenModel.save();

	const refreshTokenModel = new Token();
	refreshTokenModel.token = token.token.refresh_token;
	refreshTokenModel.type = 'refresh';
	refreshTokenModel.save();
}

class TokenController {
	/**
	 * Request for a link from Graph for Microsoft account authentication.
	 *
	 * @param {Object} Context The context object.
	 */
	async getAuthUrl ({ response }) {
		const authUrl = await Oauth2.authorizationCode.authorizeURL({
			redirect_uri: Env.get('MICROSOFT_REDIRECT_URI'),
			scope: Env.get('MICROSOFT_SCOPES')
		});

		return response.redirect(authUrl);
	}

	/**
	 * Request for an access token from Graph.
	 *
	 * @param {Object} Context The context object.
	 */
	async authorize ({ request }) {
		const code = request.only(['code']).code;

		if (code) {
			const token = await this.getAccessTokenFromAuthCode(code);
			return token;
		}
	}

	/**
	 * Request for an access token from Graph with an authencation code.
	 *
	 * @param {String} authCode The authencation code.
	 */
	async getAccessTokenFromAuthCode (authCode) {
		try {
			let result = await Oauth2.authorizationCode.getToken({
				code: authCode,
				redirect_uri: Env.get('MICROSOFT_REDIRECT_URI'),
				scope: Env.get('MICROSOFT_SCOPES')
			});

			const token = await Oauth2.accessToken.create(result);

			saveToDatabase(token);

			return token.token.access_token;
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * Get access token from Cookie.
	 *
	 * @param {Object} Context The context object.
	 */
	async getAccessTokenFromCookie ({ request, response }) {
		const cookies = request.cookies();
		const accessToken = cookies.accessToken;

		if (accessToken) {
			const fiveMinutes = 300000;
			const expiration = new Date(parseFloat(cookies.graph_token_expires - fiveMinutes));

			if (expiration > new Date()) {
				return accessToken;
			}
		}

		const refreshToken = cookies.refreshToken;
		if (refreshToken) {
			const newToken = await Oauth2.accessToken.create({
				refresh_token: refreshToken
			}).refresh();
			this.saveToCookie(newToken, response);

			return newToken.token.access_token;
		}

		return null;
	}

	/**
	 * Save tokens to Cookie.
	 *
	 * @param {Object} token Tokens to be saved.
	 * @param {Object} response Response object to access Cookie.
	 */
	saveToCookie (token, response) {
		const user = JWT.decode(token.token.id_token);

		response.cookie('accessToken', token.token.access_token, {
			maxAge: 3600000,
			httpOnly: true
		});

		response.cookie('username', user.name, {
			maxAge: 3600000,
			httpOnly: true
		});

		response.cookie('refreshToken', token.token.refresh_token, {
			maxAge: 7200000,
			httpOnly: true
		});

		response.cookie('tokenExpiry', token.token.expires_at.getTime(), {
			maxAge: 3600000,
			httpOnly: true
		});
	}

	async test ({ request, session, response }) {
		this.show();
		return response.redirect('back');
	}

	show () {
		console.log('hi')
		const message = ['1', '2', '3', '4', '5'];
		setTimeout(() => {
			console.log('yo')
			Event.fire('send.message', message[0]);
		}, 1000);

		setTimeout(() => {
			console.log('yo')
			Event.fire('send.message', message[1]);
		}, 1500);

		setTimeout(() => {
			console.log('yo')
			Event.fire('send.message', message[2]);
		}, 2000);

		setTimeout(() => {
			console.log('yo')
			Event.fire('send.message', message[3]);
		}, 2500);

		setTimeout(() => {
			console.log('yo')
			Event.fire('send.message', message[4]);
		}, 3000);
	}
}

module.exports = TokenController;
