$('#fixed-submit').on('click', function () {
	$( "#loadingSearch" ).remove();
	setTimeout(function() {
		$('#fixed-submit').append('<i id="loadingSearch" class="fas fa-circle-notch fa-spin fa-1x"></i>');
	}, 500);
});

$('#flexible-submit').on('click', function () {
	$( "#loadingSearch" ).remove();
	setTimeout(function() {
		$('#flexible-submit').append('<i id="loadingSearch" class="fas fa-circle-notch fa-spin fa-1x"></i>');
	}, 500);
});