'use strict'

const User = use('App/Models/User');
const PasswordReset = use('App/Models/PasswordReset');
const Mail = use('Mail');
const Hash = use('Hash');

class UserController {

  async create({ request, response, auth}) {
	  var userInfo=request.only(['username','email','password']);
	  console.log(userInfo)
      userInfo['role']=2;
      const user = await User.create(userInfo);

      await auth.login(user);
      return response.redirect('/');
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

  async sendMail ({ request, response }) {
	const email = request.body.email
    const results = await User
    	.query()
    	.where('email', '=', email)
		.fetch();
	const rows = results.toJSON();

	if(rows.length != 0) {
		let hash = this.random(4);

		let row = { email: email,
					hash: hash};
		console.log(row);
		await PasswordReset.create(row);

		let body = `
		<h2> Password Reset Request </h2>
		<p>
			We received a request to reset your password. If you asked to reset your password, please click the following URL into your browser: 
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

	const results = await PasswordReset
		.query()
		.where('hash', '=', hash)
		.fetch();

	console.log(hash)
	if(results) {
		const rows = results.toJSON();
		const email = rows[0].email; 

		return view.render('resetPassword', {email: email});
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

  random(times) {
	
	let result = '';

	for (let i=0; i < times; i++) {
		result += Math.random().toString(36).substring(2);
	}

	return result;
  }
}

module.exports = UserController
