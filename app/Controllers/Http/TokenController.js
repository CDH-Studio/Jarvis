'use strict'
const Env = use('Env');

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

class TokenController {
	async getAuthUrl({ response }) {
		const returnVal = await Oauth2.authorizationCode.authorizeURL({
			redirect_uri: Env.get('MICROSOFT_REDIRECT_URI'),
			scope: Env.get('MICROSOFT_SCOPES')
		});

		//console.log(`Auth url: ${returnVal}`);
		return response.redirect(returnVal);
	}

  	async authorize({ request }) {
		const code = request.only(['code']).code;
		
		if(code) {
			const token = await this.getAccessToken(code);
			return token;
		}
	}

	async getAccessToken(authCode) {
		try {
			let result = await Oauth2.authorizationCode.getToken({
				code: authCode,
				redirect_uri: Env.get('MICROSOFT_REDIRECT_URI'),
				scope: Env.get('MICROSOFT_SCOPES')
			});

			const token = Oauth2.accessToken.create(result);
			
			return token.token.access_token;
		} catch(err) {
			console.log(err)
		}
	}
}

module.exports = TokenController
