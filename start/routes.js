'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.get('/', 'HomeController.dashboard').as('home');
//Route.on('/').render('welcome')
Route.on('/sample').render('sample');
//Route.on('/sample').render('sample');


Route.on('/register').render('auth.signup').as('register');
Route.on('/login').render('auth.login').as('login');
Route.post('/login', 'UserController.login').validator('LoginUser');

Route.post('/register', 'UserController.create').validator('CreateUser');

Route.get('/logout', 'UserController.logout').as('logout');

Route.on('/addRoom').render('adminDash/addRoomForm').as('addRoom');
Route.on('/removeRoom').render('adminDash/removeRoomForm').as('removeRoom');



