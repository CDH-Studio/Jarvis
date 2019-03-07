'use strict';

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const UserRole = use('App/Models/UserType');


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
		
		var role = await UserRole.find(this.role);
		return role.role_name;
	}

	async setUserRole (role) {
		try{
			role = await UserRole.findByOrFail('role_name', role);
			this.role=role.id;
			this.save;
			console.log(this.role);
			return (1);
		}catch(error){
			console.log("Role Set Failed");
			return 0;
		}
	}
}

module.exports = User;
