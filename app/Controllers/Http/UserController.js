'use strict'

const User = use('App/Models/User');
const AccountRequest = use('App/Models/AccountRequest');
const Mail = use('Mail');
const Hash = use('Hash');
const Env = use('Env');

function random(times) {
		
	let result = '';

	for (let i=0; i < times; i++) {
		result += Math.random().toString(36).substring(2);
	}

	return result;
};

class UserController {
	async create({ request, response, auth}) {
		var userInfo=request.only(['username','email','password']);
		userInfo['role']=2;

		const confirmationRequired = Env.get('REGISTRATION_CONFIRMATION', false);

		if(confirmationRequired) {
			console.log(userInfo)
			let hash = random(4);
			let body = `
			<h2> Welcome to Jarvis </h2>
			<p>
				Please click the following URL into your browser: 
				http://localhost:3333/newPassword?hash=${hash}
			</p>
			`
			
			await Mail.raw(body, (message) => {
				message
					.to(userInfo.email)
					.from('support@mail.cdhstudio.ca')
					.subject('Verify Email Address for Jarvis')
			})
			console.log('mail sent')
      		const user = await User.create(userInfo);
      		//await auth.login(user);
			return response.redirect('/login');
		}
	}
	  
	async verifyUser({ request, view }) {
		const hash = request._all.hash
		if(hash) {
			const results = await AccountRequest
				.query()
				.where('hash', '=', hash)
				.fetch();
			const rows = results.toJSON();
			console.log(hash)

			if(rows.length !== 0 && rows[0].type === 2) {
				let row = { email: rows[0].email,
							username: row[0].username,
							password: row[0].password, 
							role: 2};
				console.log(row);
				await AccountRequest.create(row);
			}
		}
	}

	async createAdmin({ request, response, auth}) {
		var adminInfo=request.only(['username','email','password']);
		adminInfo['role']=1;
		console.log(adminInfo);
		const user = await User.create(adminInfo);

		await auth.login(user);
		return response.redirect('/');
	}

	async login({ request, auth, response, session }) {
		const { email, password } = request.all();
		try {
			await auth.attempt(email, password);
			return response.redirect('/');
		} catch (error) {
			session.flash({loginError: 'These credentials do not work.'})
			return response.redirect('/login');
		}
	}

	async logout({ auth, response }){
		await auth.logout();
		return response.redirect('/');
	}


	show ({ auth, params }) {
		if (auth.user.id !== Number(params.id)) {
		return 'You cannot see someone else\'s profile'
		}
		return auth.user
	}

	async sendPasswordResetMail ({ request, response }) {
		const email = request.body.email
		const results = await User
			.query()
			.where('email', '=', email)
			.fetch();
		const rows = results.toJSON();

		if(rows.length != 0) {
			let hash = random(4);

			let row = { email: email,
						hash: hash,
						type: 1};
			console.log(row);
			await AccountRequest.create(row);

			let body = `
			<h2> Password Reset Request </h2>
			<p>
				We received a request to reset your password. If you asked to reset your password, please click the following URL: 
				http://localhost:3333/newPassword?hash=${hash}
			</p>
			`

			await Mail.raw(body, (message) => {
				message
					.to(email)
					.from('support@mail.cdhstudio.ca')
					.subject('Password Reset Request')
			})
			console.log('mail sent')
		}
		
		return response.redirect('/login');
	}

	async verifyHash({ request, view }) {
		const hash = request._all.hash
		if(hash) {
			const results = await AccountRequest
				.query()
				.where('hash', '=', hash)
				.fetch();
			const rows = results.toJSON();
			console.log(hash)

			if(rows.length !== 0 && rows[0].type === 1) {
				const email = rows[0].email; 

				return view.render('resetPassword', {email: email});
			}
		}
	}

	async resetPassword({ request, response }) {
		console.log(request.body)
		const newPassword = await Hash.make(request.body.password);
		const changedRow = await User
			.query()
			.where('email', request.body.email)
			.update({ password: newPassword });

		console.log(changedRow);
		return response.redirect('/login');
	}
}

module.exports = UserController
