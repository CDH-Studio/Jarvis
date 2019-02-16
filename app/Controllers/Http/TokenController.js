'use strict';
const Env = use('Env');
const Token = use('App/Models/Token');

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
const JWT = require('jsonwebtoken');

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
	async getAuthUrl ({ response }) {
		const authUrl = await Oauth2.authorizationCode.authorizeURL({
			redirect_uri: Env.get('MICROSOFT_REDIRECT_URI'),
			scope: Env.get('MICROSOFT_SCOPES')
		});

		return response.redirect(authUrl);
	}

	async authorize ({ request }) {
		const code = request.only(['code']).code;

		if (code) {
			const token = await this.getAccessTokenFromAuthCode(code);
			return token;
		}
	}

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

			return newToken.token.access_token;
		}

		return null;
	}

	saveToCookie (token, res) {
		const user = JWT.decode(token.token.id_token);

		res.cookie('accessToken', token.token.access_token, {
			maxAge: 3600000,
			httpOnly: true
		});

		res.cookie('username', user.name, {
			maxAge: 3600000,
			httpOnly: true
		});

		res.cookie('refreshToken', token.token.refresh_token, {
			maxAge: 7200000,
			httpOnly: true
		});

		res.cookie('tokenExpiry', token.token.expires_at.getTime(), {
			maxAge: 3600000,
			httpOnly: true
		});
	}
}

module.exports = TokenController;
