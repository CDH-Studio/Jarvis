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

Route.get('/', 'HomeController.home').as('home');
Route.on('/welcome').render('welcome');

Route.get('/switch/:lang', 'HomeController.changeLang');

//= ========================================================================
// Auth
//= ========================================================================

// User Authentication
Route.get('/register', 'UserController.registerUserRender').as('registerUser');
Route.post('/register', 'UserController.create').validator('CreateUser');

// Admin Authentication
Route.get('/admin/register', 'UserController.registerAdminRender').as('registerAdmin');
Route.post('/admin/register', 'UserController.createAdmin').as('CreateAdmin').validator('CreateAdmin');

// Logout
Route.get('/login', 'UserController.loginRender').as('login');
Route.post('/login', 'UserController.login').validator('LoginUser');
Route.get('/logout', 'UserController.logout').as('logout');

// Forgot password
Route.get('/forgotPassword', 'UserController.forgotPasswordRender').as('forgotPassword');
Route.post('/resetPassword', 'UserController.resetPassword').as('resetPassword').validator('ResetPassword');
Route.get('/newPassword', 'UserController.verifyHash');
Route.get('/newUser', 'UserController.verifyEmail');
Route.post('/createPasswordResetRequest', 'UserController.createPasswordResetRequest').as('createPasswordResetRequest');

// Authentication
Route.get('/user/:id', 'UserController.show').as('viewProfile').middleware(['auth']);
Route.get('/allUsers', 'UserController.getAllUsers').as('allUsers').middleware(['isAdmin']);
Route.get('/user/:id/edit', 'UserController.edit').as('editUser').middleware(['auth']);
Route.post('/user/:id/edit', 'UserController.update').as('saveUser').validator('EditUser').middleware(['isUser']);
Route.post('/user/:id/editAdmin', 'UserController.update').as('saveAdmin').validator('EditAdmin').middleware(['isAdmin']);
Route.post('/user/updatepassword', 'UserController.changePassword').as('changePassword').middleware(['auth']).validator('ResetPassword');

//= ========================================================================
//  Rooms
//= ========================================================================

// admin
Route.get('/addRoom', 'RoomController.create').as('addRoomForm').middleware(['isAdmin']);
Route.post('/addRoom', 'RoomController.add').as('addRoom').validator('AddRoom').middleware(['isAdmin']);
Route.get('/adminDash', 'HomeController.adminDashboard').as('adminDash').middleware(['isAdmin']);

Route.get('/rooms/:id', 'RoomController.show').as('showRoom').middleware(['auth']);
Route.get('/rooms/:id/edit', 'RoomController.edit').as('editRoom').middleware(['isAdmin']);
Route.post('/rooms/:id/edit', 'RoomController.update').as('saveRoom').validator('EditRoom').middleware(['isAdmin']);
Route.get('/rooms', 'RoomController.getAllRooms').as('allRooms').middleware(['auth']);

Route.get('/configure', 'featureController.show').as('configuration').middleware(['isAdmin']);
Route.post('/feature/add', 'featureController.addRoomFeature').as('addRoomFeature').validator('AddFeature').middleware(['isAdmin']);
Route.post('/feature/:id', 'featureController.deleteRoomFeature').as('deleteRoomFeature').middleware(['isAdmin']);


Route.get('/room/:roomID/issues/:issueStatus', 'IssueController.getRoomIssues').as('showIssue').middleware(['isAdmin']);
Route.get('/issue/:id/edit', 'IssueController.editIssue').as('editIssue').middleware(['isAdmin']);
Route.post('/issue/:id/edit', 'IssueController.updateIssue').as('updateIssue').middleware(['isAdmin']).validator('EditIssue');

// user
Route.post('/addReview/:id', 'ReviewController.add').as('addReview').validator('AddReview').middleware(['isUser']);
Route.post('/editReview/:id', 'ReviewController.edit').as('editReview').validator('AddReview').middleware(['isUser']);
Route.post('/deleteReview/:id', 'ReviewController.delete').as('deleteReview').middleware(['isUser']);
Route.post('/reportRoom', 'IssueController.submit').as('reportRoom').middleware(['isUser']).validator('ReportRoom');

//= ========================================================================
// Bookings
//= ========================================================================
Route.post('/goToDetails', 'RoomController.goToDetails').as('goToDetails').middleware(['auth']); // needs to be changed to get
Route.get('/:bookingType/:id/bookings', 'BookingController.getBookings').as('viewBookings').middleware(['auth']);
Route.post('/:bookingType/cancelBooking/:id', 'BookingController.cancelBooking').as('cancelBooking').middleware(['auth']);

// Employee user pages
Route.get('/userDash', 'HomeController.userDashboard').as('userDash').middleware(['isUser']);
Route.get('/searchRooms', 'RoomController.loadSearchRoomsForm').as('searchRooms').middleware(['isUser']);
Route.on('/manageBookings').render('userPages/manageBookings').as('manageBooking').middleware(['isUser']);

// Rendering Results
Route.get('/results', 'RoomController.getSearchRooms').as('results').middleware(['auth']).validator('SearchRoom').middleware(['isUser']);

// Booking a Room
Route.post('/confirmBooking', 'BookingController.confirmBooking').as('confirmBooking').validator('BookRoom').middleware(['isUser']);

// Outlook
Route.get('/authenticate', 'TokenController.getAuthUrl');
Route.get('/authorize', 'TokenController.authorize');
Route.get('/events', 'RoomController.getEvents');
Route.get('/event', 'BookingController.createEvent');
Route.get('/calendars', 'RoomController.getCalendars');
Route.get('/calendar', 'RoomController.getCalendar');

//= ========================================================================
// Chatbot
//= ========================================================================
Route.post('/message', 'Roomcontroller.sendMessage').as('message');

//= ========================================================================
// Pusher
//= ========================================================================
Route.get('/push', 'TokenController.push').as('push');
