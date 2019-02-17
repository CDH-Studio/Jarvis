'use strict';

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
const Route = use('Route');

Route.get('/', 'HomeController.dashboard').as('home');
Route.on('/welcome').render('welcome');
Route.on('/sample').render('sample');

Route.on('/register').render('auth.signup').as('register');
Route.on('/login').render('auth.login').as('login');
Route.post('/login', 'UserController.login').validator('LoginUser');
Route.get('/user/:id', 'UserController.show').as('viewProfile');
Route.get('/user/:id/edit', 'UserController.edit');
Route.post('/user/:id/updatepassword', 'UserController.changePassword').as('changePassword');

// Route.on('/user/:id', 'UserController.show').render('auth.showUser');

// Admin Register page
Route.on('/admin/register').render('auth.signupAdmin').as('registerAdmin');
Route.post('/admin/register', 'UserController.createAdmin').as('CreateAdmin').validator('CreateAdmin');
Route.post('/register', 'UserController.create').validator('CreateUser');
Route.get('/logout', 'UserController.logout').as('logout');

// Room pages
Route.on('/addRoom').render('adminDash/addRoomForm').as('addRoom');
Route.on('/removeRoom').render('adminDash/removeRoomForm').as('removeRoom');
Route.post('/addRoom', 'RoomController.addRoom').validator('addRoom');
Route.on('/roomDetails').render('adminDash/roomDetails').as('roomDetails');
Route.post('/confirmBooking', 'RoomController.confirmBooking').as('confirmBooking');
Route.get('/allRooms', 'RoomController.getAllRooms').as('allRooms');
Route.post('/goToDetails', 'RoomController.goToDetails').as('goToDetails');

Route.get('/addRoom/edit/:id', 'RoomController.edit').as('editRoom');
Route.put('addRoom/:id', 'RoomController.update').as('saveRoom');

// Forgot password
Route.on('/forgotPassword').render('forgotPassword').as('forgotPassword');
Route.post('/resetPassword', 'UserController.resetPassword').as('resetPassword').validator('resetPassword');
Route.get('/newPassword', 'UserController.verifyHash');
Route.get('/newUser', 'UserController.verifyEmail');
Route.post('/createPasswordResetRequest', 'UserController.createPasswordResetRequest').as('createPasswordResetRequest');
Route.post('/changePassword', 'UserController.changePassword').as('changePassword');// .validator('changePassword');

// Employee user pages
Route.on('/searchRooms').render('userPages/searchRooms').as('searchRooms');
Route.on('/manageBookings').render('userPages/manageBookings').as('manageBooking');

// Temporary routes ***** Need to change so that a userr cannot acess this through URL ****
Route.on('/results').render('userPages/results').as('results');

// ************ Needs a unique url for all rooms **********
Route.on('/details').render('userPages/roomDetails');

Route.get('/authenticate', 'TokenController.getAuthUrl');
Route.get('/authorize', 'TokenController.authorize');
Route.get('/events', 'RoomController.getEvents');
Route.get('/event', 'RoomController.createEvent');
Route.get('/calendars', 'RoomController.getCalendars');
Route.get('/calendar', 'RoomController.getCalendar');
Route.on('/details').render('userPages/roomDetails').as('roomDetails');
Route.get('/room/:id', 'RoomController.show');

Route.on('/booking').render('userPages/booking').as('booking');
