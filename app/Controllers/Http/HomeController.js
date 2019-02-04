'use strict'

const User = use('App/Models/User');
const view = use('View');


class HomeController {

  async dashboard({ request, response, auth}) {
      if(auth.user){
          return view.render('welcome')
      }
      return response.redirect('/login');
  }

}

module.exports = HomeController
