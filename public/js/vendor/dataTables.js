$(document).ready(function() {
	$('#issuesTable').DataTable( {
	    "paging":   false,
	    "ordering": true,
	    "info":     false,
	    "processing": true,
	    "order": [[ 0, "desc" ]]
	});
});
