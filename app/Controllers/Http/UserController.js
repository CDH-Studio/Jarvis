'use strict'

const User = use('App/Models/User');
const Mail = use('Mail')

class UserController {

  async create({ request, response, auth}) {
      const user = await User.create(request.only(['username','email','password']));

      console.log(user);
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

  async sendMail () {
    await Mail.send('emails.testMail', {}, (message) => {
      message
        .to('liyunwei10@gmail.com')
        //.from('hello@sparkpostbox.com')
        .from('liyunwei10@gmail.com')
        .subject('Welcome to Jasper')
    })

    return 'Registered successfully'
  }
}

module.exports = UserController
