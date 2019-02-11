'use strict'

const User = use('App/Models/User');
const AccountRequest = use('App/Models/AccountRequest');
const Mail = use('Mail');
const Hash = use('Hash');
const Env = use('Env');
const view = use('View');

function random(times) {
		
	let result = '';

	for (let i=0; i < times; i++) {
		result += Math.random().toString(36).substring(2);
	}

	return result;
};

/**
 * 
 * @param {string} subject  Subject of Email
 * @param {string} body     Body of Email 
 * @param {string} to       Sending address
 * @param {string} from     Receiving address
 */
function sendMail(subject, body, to, from) {
	Mail.raw(body, (message) => {
		message
			.to(to)
			.from(from)
			.subject(subject)
	})
	console.log('mail sent')
};

class UserController {
	async create({ request, response, auth}) {
		const confirmationRequired = Env.get('REGISTRATION_CONFIRMATION', false);

		if(confirmationRequired) {
			console.log('with')
			return this.createWithVerifyingEmail({request, response});
		} else {
			console.log('without')
			return this.createWithoutVerifyingEmail({request, response, auth});
		}
	}

	async createWithoutVerifyingEmail({ request, response, auth}) {
		var userInfo=request.only(['username','email','password']);
		userInfo.role = 2;
		userInfo.verified = true;
		console.log(userInfo)
      	const user = await User.create(userInfo);

      	await auth.login(user);
      	return response.redirect('/');
  	}

	async createWithVerifyingEmail({ request, response, auth}) {
		var userInfo=request.only(['username','email','password']);
		userInfo.role = 2;
		userInfo.verified = false;

		console.log(userInfo)

		let hash = random(4);

		let row = { email: userInfo.email,
					hash: hash,
					type: 2};
		await AccountRequest.create(row);

		let body = `
		<h2> Welcome to Jarvis </h2>
		<p>
			Please click the following URL into your browser: 
			http://localhost:3333/newUser?hash=${hash}
		</p>
		`
		
		await sendMail('Verify Email Address for Jarvis', 
						body, userInfo.email, 'support@mail.cdhstudio.ca');

		await User.create(userInfo);
		return response.redirect('/login');
	}
	  
	async verifyEmail({ request, response}) {
		const hash = request._all.hash

		try {
			let results = await AccountRequest
				.query()
				.where('hash', '=', hash)
				.fetch();
			let rows = results.toJSON();
			console.log(rows)
			const email = rows[0].email;

			await User
				.query()
				.where('email', email)
				.update({ verified: true });
			
			return response.redirect('/');
		} catch(err) {
			console.log(err)
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

		const user = await User
			.query()
			.where('email', email)
			.where('verified', true)
			.first();
	
		try {
			await auth.attempt(user.email, password);
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

	async show ({ auth, params }) {
    const user = await User.find(Number(params.id));
    var canEdit=0;
    //if user is admin
    if (auth.user.role==1){
      var layoutType='layouts/adminLayout';
      canEdit=1;
    //check if user is viewing their own profile
    }else if(auth.user.id == Number(params.id) && auth.user.role==2){
      var layoutType='layouts/mainLayout';
      canEdit=1;
    //check if user is viewing someone elses profile
    }else if(auth.user.id != Number(params.id) && auth.user.role==2){
      var layoutType='layouts/mainLayout';
      canEdit=0;
    }else{
      return response.redirect('/');
    }

		return view.render('auth.showUser',{auth, user ,layoutType});
	}

	async createPasswordResetRequest ({ request, response }) {
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
			await sendMail('Password Reset Request', 
							body, email, 'support@mail.cdhstudio.ca');
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
