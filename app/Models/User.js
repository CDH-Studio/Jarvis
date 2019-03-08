'use strict';

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const UserRole = use('App/Models/UserType');
const Logger = use('Logger')


class User extends Model {
	static boot () {
		super.boot();

		/**
		 * A hook to hash the user password before saving
		 * it to the database.
		 */
		this.addHook('beforeSave', async (userInstance) => {
			if (userInstance.dirty.password) {
				userInstance.password = await Hash.make(userInstance.password);
			}
		});
	}

	/**
	 * A relationship on tokens is required for auth to
	 * work. Since features like `refreshTokens` or
	 * `rememberToken` will be saved inside the
	 * tokens table.
	 *
	 * @method tokens
	 *
	 * @return {Object}
	 */
	tokens () {
		return this.hasMany('App/Models/Token');
	}

	bookings () {
		return this.hasMany('App/Models/Booking');
	}

	async getUserRole () {
		try{
			var role = await UserRole.findOrFail(this.role_id);
			return role.role_name;
		}catch(error){
			logger.error("Role Lookup Failed");
			return 0;
		}
	}

	async setUserRole (role) {
		try{
			role = await UserRole.findByOrFail('role_name', role);
			this.role_id=role.id;
			this.save();
			console.log(this.role_id);
			return 1;
		}catch(error){
			logger.error("Role Set Failed");
			return 0;
		}
	}
}

module.exports = User;
