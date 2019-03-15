'use strict';

const Model = use('Model');

class UserRole extends Model {
	static get table () {
		return 'user_roles';
	}

	user () {
		return this.belongsToMany('App/Model/User');
	}

	static async getRoleID (role_name) {
		var role = await this.findByOrFail('role_name', role_name);
		return role.id;
	}

	static async getRoleName (role_id) {
		var role = await this.findOrFail(this.role_id);
		return role.name;
	}
}

module.exports = UserRole;
