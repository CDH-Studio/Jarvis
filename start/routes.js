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

Route.on('/register').render('auth.signup').as('register');
Route.on('/login').render('auth.login').as('login');
Route.post('/login', 'UserController.login').validator('LoginUser');

// Admin Register page
Route.on('/admin/register').render('auth.signupAdmin').as('registerAdmin');
Route.post('/admin/register','UserController.createAdmin').as('CreateAdmin').validator('CreateAdmin');
Route.post('/register', 'UserController.create').validator('CreateUser');
Route.get('/logout', 'UserController.logout').as('logout');

// Add and remove room forms
Route.on('/addRoom').render('adminDash/addRoomForm').as('addRoom');
Route.on('/removeRoom').render('adminDash/removeRoomForm').as('removeRoom');
Route.post('/addRoom', 'RoomController.addRoom').validator('addRoom');
Route.post('/add_room', 'RoomController.addRoom');

// Employee user pages
Route.on('/booking').render('userPages/booking').as('booking');
Route.on('/manageBookings').render('userPages/manageBookings').as('manageBooking');

// Forgot password
Route.on('/forgotPassword').render('forgotPassword').as('forgotPassword');
Route.post('/resetPassword', 'UserController.resetPassword').as('resetPassword');
Route.get('/newPassword', 'UserController.verifyHash');
Route.post('/send_mail', 'UserController.sendMail').as('sendMail');

Route.on('/searchRooms').render('userPages/searchRooms').as('searchRooms');
