export function notify ({
	$,
	message,
	type = 'success',
	x = 10,
	y = 10,
	from = 'top',
	align = 'right',
	url = '',
	enter = 'fadeInRight',
	exit = 'fadeOutUp',
	element = 'body'
} = {}) {
	$.notify({
		message: message,
		url: url
	}, {
		element: element,
		type: type,
		animate: {
			enter: 'animated ' + enter,
			exit: 'animated ' + exit
		},
		placement: {
			from: from,
			align: align
		},
		offset: {
			x: x,
			y: y
		},
		spacing: 10,
		z_index: 1031
	});
};
