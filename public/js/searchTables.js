(function ($) {
	'use strict'; // Start of use strict

	$(document).ready(function () {
		$('#searchField').on('keyup', function () {
			var value = $(this).val().toLowerCase();
			$('#roomsTable tr').filter(function () {
				$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
			});
		});
	});
})(jQuery); // eslint-disable-line
