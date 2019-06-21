$('#submit').on('click', function () {
	if ($("#capacity").val() > 100) {
		return;
	}

	$( "#loadingSearch" ).remove();
	setTimeout(function() {
		$('#submit').append('<i id="loadingSearch" class="fas fa-circle-notch fa-spin fa-1x"></i>');
	}, 500);
});