'use strict';

/*
|--------------------------------------------------------------------------
| TEMP Issues Seeder
|--------------------------------------------------------------------------
|
| Seed table with room issues/reports for dev purposes
|
*/
const Reports = use('App/Models/Report');

class TempIssuesSeeder {
	async run () {
		// generating fake use reports
		var issueFiller = [
			{ 'user_id': 4, 'building_id': 1, 'room_id': 24, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada', 'report_status_id': 2 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 10, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing', 'report_status_id': 2 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 38, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus.', 'report_status_id': 2 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 2, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat.', 'report_status_id': 3 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 23, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at', 'report_status_id': 1 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 30, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis', 'report_status_id': 3 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 12, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus', 'report_status_id': 1 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 26, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque', 'report_status_id': 2 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 16, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum', 'report_status_id': 2 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 37, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor.', 'report_status_id': 3 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 20, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum', 'report_status_id': 1 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 9, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing', 'report_status_id': 2 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 39, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor.', 'report_status_id': 2 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 41, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus', 'report_status_id': 2 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 9, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus', 'report_status_id': 3 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 15, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat.', 'report_status_id': 2 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 12, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor.', 'report_status_id': 2 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 15, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque', 'report_status_id': 3 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 6, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede ac', 'report_status_id': 2 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 26, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut', 'report_status_id': 1 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 17, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna', 'report_status_id': 2 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 19, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing', 'report_status_id': 3 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 11, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede', 'report_status_id': 3 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 10, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis', 'report_status_id': 1 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 21, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt', 'report_status_id': 2 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 3, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum', 'report_status_id': 2 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 2, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque', 'report_status_id': 1 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 34, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt', 'report_status_id': 3 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 18, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a,', 'report_status_id': 2 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 34, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non,', 'report_status_id': 1 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 10, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede', 'report_status_id': 1 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 6, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer', 'report_status_id': 1 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 7, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed', 'report_status_id': 1 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 37, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede ac urna. Ut', 'report_status_id': 2 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 5, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing', 'report_status_id': 2 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 41, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis', 'report_status_id': 2 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 3, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur', 'report_status_id': 2 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 32, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis', 'report_status_id': 3 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 22, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede ac', 'report_status_id': 1 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 6, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis', 'report_status_id': 2 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 13, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet', 'report_status_id': 2 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 15, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras', 'report_status_id': 2 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 14, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin', 'report_status_id': 1 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 34, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis', 'report_status_id': 2 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 2, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque', 'report_status_id': 2 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 29, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna.', 'report_status_id': 1 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 2, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin', 'report_status_id': 3 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 30, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a,', 'report_status_id': 3 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 33, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus.', 'report_status_id': 2 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 17, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing', 'report_status_id': 1 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 8, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede', 'report_status_id': 3 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 23, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor.', 'report_status_id': 1 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 29, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede ac', 'report_status_id': 3 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 9, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer', 'report_status_id': 1 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 5, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam', 'report_status_id': 2 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 35, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor.', 'report_status_id': 2 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 33, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa', 'report_status_id': 1 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 11, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at', 'report_status_id': 2 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 4, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque', 'report_status_id': 3 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 23, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non,', 'report_status_id': 1 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 14, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque', 'report_status_id': 3 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 19, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet', 'report_status_id': 1 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 5, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet,', 'report_status_id': 1 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 27, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque', 'report_status_id': 1 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 10, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet', 'report_status_id': 2 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 24, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien,', 'report_status_id': 1 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 40, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat.', 'report_status_id': 2 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 12, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.', 'report_status_id': 1 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 23, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa', 'report_status_id': 2 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 9, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum', 'report_status_id': 3 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 5, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin', 'report_status_id': 1 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 24, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus.', 'report_status_id': 1 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 3, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam', 'report_status_id': 1 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 2, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis', 'report_status_id': 3 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 9, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida', 'report_status_id': 1 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 27, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus.', 'report_status_id': 2 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 21, 'report_type_id': 3, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet', 'report_status_id': 3 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 12, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non,', 'report_status_id': 3 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 12, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam', 'report_status_id': 3 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 25, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin', 'report_status_id': 2 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 34, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede ac', 'report_status_id': 3 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 29, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus', 'report_status_id': 3 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 4, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum', 'report_status_id': 3 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 38, 'report_type_id': 2, 'comment': 'Lorem ipsum dolor sit amet, consectetuer', 'report_status_id': 3 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 16, 'report_type_id': 1, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque', 'report_status_id': 2 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 1, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam', 'report_status_id': 2 },
			{ 'user_id': 2, 'building_id': 1, 'room_id': 3, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor.', 'report_status_id': 1 },
			{ 'user_id': 4, 'building_id': 1, 'room_id': 25, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede', 'report_status_id': 3 },
			{ 'user_id': 3, 'building_id': 1, 'room_id': 36, 'report_type_id': 5, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque', 'report_status_id': 2 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 20, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper.', 'report_status_id': 3 },
			{ 'user_id': 1, 'building_id': 1, 'room_id': 12, 'report_type_id': 4, 'comment': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu', 'report_status_id': 3 }
		];

		console.log('reportxxxxxx DB: Finished Seeding');
		var count = await Reports.getCount();

		if (count === 0) {
			for (var i = 0; i < issueFiller.length; i++) {
				const report = new Reports();
				report.user_id = issueFiller[i].user_id;
				report.building_id = issueFiller[i].building_id;
				report.room_id = issueFiller[i].room_id;
				report.report_type_id = issueFiller[i].report_type_id;
				report.comment = issueFiller[i].comment;
				report.report_status_id = issueFiller[i].report_status_id;
				await report.save();
			}
			console.log('Reports DB: Finished Seeding');
		} else {
			console.log('Reports Status DB: Already Seeded');
		}
	}
}

module.exports = TempIssuesSeeder;
