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

//= ========================================================================
// Auth
//= ========================================================================

// User Authentication
Route.on('/register').render('auth.signup').as('register');
Route.post('/register', 'UserController.create').validator('CreateUser');

// Admin Authentication
Route.on('/admin/register').render('auth.signupAdmin').as('registerAdmin');
Route.post('/admin/register', 'UserController.createAdmin').as('CreateAdmin').validator('CreateAdmin');

// Logout
Route.get('/login', 'UserController.loginRender').as('login');
Route.post('/login', 'UserController.login').validator('LoginUser');
Route.get('/logout', 'UserController.logout').as('logout');

// Forgot password
Route.on('/forgotPassword').render('forgotPassword').as('forgotPassword');
Route.post('/resetPassword', 'UserController.resetPassword').as('resetPassword').validator('ResetPassword');
Route.get('/newPassword', 'UserController.verifyHash');
Route.get('/newUser', 'UserController.verifyEmail');
Route.post('/createPasswordResetRequest', 'UserController.createPasswordResetRequest').as('createPasswordResetRequest');

// Authentication
Route.get('/user/:id', 'UserController.show').as('viewProfile').middleware(['auth']);
Route.get('/allUsers', 'UserController.getAllUsers').as('allUsers').middleware(['auth']);
Route.get('/user/:id/edit', 'UserController.edit').as('editUser').middleware(['auth']);
Route.post('/user/updatepassword', 'UserController.changePassword').as('changePassword').middleware(['auth']).validator('ResetPassword');

//= ========================================================================
//  [ Admin ] Rooms
//= ========================================================================

// admin
Route.get('/addRoom', 'RoomController.create').as('addRoomForm').middleware(['admin']);
Route.post('/addRoom', 'RoomController.addRoom').as('addRoom').validator('AddRoom').middleware(['admin']);
Route.on('/adminDash').render('adminDash').as('adminDash').middleware(['admin']);

Route.get('/room/:id/edit', 'RoomController.edit').as('editRoom').middleware(['admin']);
Route.post('/room/:id/edit', 'RoomController.update').as('saveRoom').validator('EditRoom').middleware(['admin']);

Route.get('/allRooms', 'RoomController.getAllRooms').as('allRooms').middleware(['auth']);
Route.get('/room/:id', 'RoomController.show').as('showRoom').middleware(['auth']);

Route.get('/roomBookings/:id', 'RoomController.getBookings').as('roomBookings').middleware(['auth']);
Route.get('/userBookings/:id', 'UserController.getBookings').as('userBookings').middleware(['auth']);

//= ========================================================================
// Bookings
//= ========================================================================
Route.post('/goToDetails', 'RoomController.goToDetails').as('goToDetails'); // needs to be changed to get
Route.get('/viewBookings', 'RoomController.viewBookings').as('viewBookings');
Route.get('/cancelBooking/:id', 'RoomController.cancelBooking').as('cancelBooking');

// Employee user pages
Route.on('/booking').render('userPages/booking').as('booking');
Route.on('/searchRooms').render('userPages/searchRooms').as('searchRooms');
Route.on('/manageBookings').render('userPages/manageBookings').as('manageBooking');

// Rendering Results
Route.get('/results', 'RoomController.getSearchRooms').as('results').middleware(['auth']).validator('SearchRoom');

// Booking a Room
Route.post('/confirmBooking', 'RoomController.confirmBooking').as('confirmBooking').validator('BookRoom');

// Outlook
Route.get('/authenticate', 'TokenController.getAuthUrl');
Route.get('/authorize', 'TokenController.authorize');
Route.get('/events', 'RoomController.getEvents');
Route.get('/event', 'RoomController.createEvent');
Route.get('/calendars', 'RoomController.getCalendars');
Route.get('/calendar', 'RoomController.getCalendar');
