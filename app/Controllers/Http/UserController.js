'use strict'

const User = use('App/Models/User');
const Mail = use('Mail')

class UserController {

  async create({ request, response, auth}) {
      var userInfo=request.only(['username','email','password']);
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
		await Mail.send('emails.passwordReset', {}, (message) => {
		message
			.to(email)
			.from('support@mail.cdhstudio.ca')
			.subject('Welcome to Jasper')
		})
		console.log('mail sent')
	}
	
	return response.redirect('/login');
  }
}

module.exports = UserController
