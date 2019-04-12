
(function ($) {
	'use strict'; // Start of use strict
	var selection = document.getElementById('recurringSelect');
	if (selection.value === '1') {
		document.getElementById('recurringInfo').style.display = '';
	}

	// Show the recurring drop down if the user selects yes, otherwise hide it  --}}
	/* eslint-disable */
	function showRecurring () {
		var selection = document.getElementById('recurringSelect');
		if (selection.value === '1') {
			document.getElementById('recurringInfo').style.display = '';
		} else {
			document.getElementById('recurringInfo').style.display = 'none';
		}
	}

	// remove the is-invalid output when the user inputs a new value
	function removeErrorClass(idOfInput){
		$('#'+idOfInput).removeClass('is-invalid');
		// Ih field is the calendar, then remove styling from erorr message
		if (idOfInput == 'date') {
			$('#date-error').removeClass('show-invalid');
		}
	}


	// update from and to inputs from dropdown
	$(document).on("click",".dropdown-menu a", function(ev) {
		$(this).siblings().removeClass('active');
		$(this).addClass("active");
		$(this).parents(".timePicker").find('.time-form').val($(this).attr('data-value'));
		$(this).parents(".timePicker").find('.time-form').removeClass('is-invalid');
		$(this).parents(".timePicker").siblings('.invalid-feedback').removeClass('show-invalid');
	});

})(jQuery); // eslint-disable-line
