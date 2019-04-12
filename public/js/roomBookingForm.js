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
	function removeErrorClass (idOfInput) {
		$('#' + idOfInput).removeClass('is-invalid');
		// Ih field is the calendar, then remove styling from erorr message
		if (idOfInput === 'date') {
			$('#date-error').removeClass('show-invalid');
		} else if (idOfInput === 'from') {
			$('#from-error').removeClass('show-invalid');
		} else if (idOfInput === 'to') {
			$('#to-error').removeClass('show-invalid');
		}
	}
	/* eslint-enable */
	// Setting from and to times
	const currentTime = new Date();
	const currentHour = currentTime.getHours();
	const currentMinutes = currentTime.getMinutes();
	let fromTime;
	let toTime;
	if (currentMinutes <= 30) {
		fromTime = currentHour + ':30';
		toTime = currentHour + 1 + ':30';
	} else {
		fromTime = currentHour + 1 + ':00';
		toTime = currentHour + 2 + ':00';
	}
	$('#from').datebox({
		mode: 'timebox',
		defaultValue: fromTime,
		minuteStep: '30',
		minuteStepRound: '1'
	});
	$('#to').datebox({
		mode: 'timebox',
		defaultValue: toTime,
		minuteStep: '30',
		minuteStepRound: '1'
	});

})(jQuery); // eslint-disable-line
