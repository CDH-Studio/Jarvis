'use strict';

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const UserRole = use('App/Models/UserRole');
const Tower = use('App/Models/Tower');
const logger = use('Logger');

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

	reviews () {
		return this.hasMany('App/Models/Review');
	}

	reports () {
		return this.hasMany('App/Models/Report');
	}

	building () {
		return this.belongsTo('App/Models/Building', 'building_id');
	}

	tower () {
		return this.belongsTo('App/Models/Tower', 'tower_id');
	}

	floor () {
		return this.belongsTo('App/Models/Floor', 'floor_id');
	}

	role () {
		return this.belongsTo('App/Models/UserRole', 'role_id');
	}

	async getUserRole () {
		try {
			var role = await UserRole.findOrFail(this.role_id);
			return role.name;
		} catch (error) {
			logger.error('Role Lookup Failed');
			return 0;
		}
	}

	async setUserRole (role) {
		try {
			role = await UserRole.findByOrFail('name', role);
			this.role_id = role.id;
			this.save();
			return 1;
		} catch (error) {
			logger.error('Role Set Failed');
			return 0;
		}
	}

	static async getName (user_id) {
		var user = await this.findOrFail(user_id);
		return user.firstname + ' ' + user.lastname;
	}

	async getUserTower () {
		try {
			var tower = await Tower.findOrFail(this.tower_id);
			return tower.name;
		} catch (error) {
			logger.error('Tower Lookup Failed');
			return 0;
		}
	}
}

module.exports = User;
