'use strict';

/**
*
* Middleware: CheckLoggedIn
* Check if user is logged-in and user role is "Admin"
*
*/

const debug = require('debug')('adonis:auth');

class CheckLoggedIn {
	constructor (Config) {
		Config = use('Config');
		const authenticator = Config.get('auth.authenticator');
		this.scheme = Config.get(`auth.${authenticator}.scheme`, null);
	}

	/**
	*
	* Attempts to authenticate the user using defined multiple schemes and
	* stops on the first one
	*
	* @method _authenticate
	*
	* @param  {Object}      auth
	* @param  {Array}      schemes
	*
	* @return valid Auth = 1
	*
	*/
	async _authenticate (auth, schemes, response) {
		let lastError = null;
		schemes = Array.isArray(schemes) && schemes.length ? schemes : [this.scheme];

		debug('attempting to authenticate via %j scheme(s)', schemes);

		/**
		* Loop over all the defined schemes and wait until use is logged
		* via anyone
		*/
		for (const scheme of schemes) {
			try {
				const authenticator = auth.authenticator(scheme);
				await authenticator.check();

				debug('authenticated using %s scheme', scheme);

				/**
				* Swapping the main authentication instance with the one using which user
				* logged in.
				*/
				auth.authenticatorInstance = authenticator;

				lastError = null;
				break;
			} catch (error) {
				debug('authentication failed using %s scheme', scheme);
				lastError = error;
			}
		}

		/**
		* If there is an error from all the schemes
		* then throw it back
		*/
		if (lastError) {
			return 0;
		}
		return 1;
	}

	/**
	*
	* Check if user is logged in and admin.
	* Loggedin: continue;
	* Not Loggedin: Redirect to login
	*
	* @param {object} ctx
	* @param {Request} ctx.request
	* @param {Function} next
	*
	*/
	async handle ({ auth, view, response }, next, schemes) {
		var authValid = await this._authenticate(auth, schemes, response);

		if (!authValid) {
			return response.redirect('/login');
		}

		if (!auth.user.verified) {
			return response.redirect('/profile');
		}

		/**
		 * For compatibility with the old API
		 */
		auth.current = auth.authenticatorInstance;

		/**
		 * Sharing user with the view
		 */
		if (view && typeof (view.share) === 'function') {
			view.share({
				auth: {
					user: auth.current.user
				}
			});
		}

		await next();
	}
}

module.exports = CheckLoggedIn;
