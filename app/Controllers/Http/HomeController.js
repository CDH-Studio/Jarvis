// 'use strict'

// const User = use('App/Models/User');

// class HomeController {

//   dashboard({auth}) {
//     try {
//       await auth.check()
//     } catch (error) {
//       response.send('You are not logged in')
//     }

//     try {
//       await auth.check();
//       var d = new Date();
//       var date = d.toLocaleDateString();
//       return view.render('adminDash',{auth,date})

//     } catch (error) {
//        return response.redirect('/login');
//     }

//   }

//   async sample() {
//       if(auth.user){
//           return view.render('sample',{auth})
//       }
//       return response.redirect('/login');
//   }

// }

// module.exports = HomeController

'use strict';

// **** UNUSED VAR - uncomment if you plan to use this var
// const User = use('App/Models/User');
const view = use('View');

class HomeController {
	async dashboard ({ request, response, auth }) {
		try {
			await auth.check();
			var d = new Date();
			var date = d.toLocaleDateString();
			console.log(auth.user.role);
			if (auth.user.role === 1) {
				return view.render('adminDash', { auth, date });
			} else {
				return view.render('userPages.booking', { auth });
			}
		} catch (error) {
			return response.redirect('/login');
		}
	}
}

module.exports = HomeController;
