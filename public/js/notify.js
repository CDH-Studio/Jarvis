export function notify ({
	$,
	message,
	type = 'success',
	x = 10,
	y = 10,
	from = 'top',
	align = 'right',
	url = ''
} = {}) {
	$.notify({
		message: message,
		url: url
	}, {
		type: type,
		animate: {
			enter: 'animated fadeInRight',
			exit: 'animated fadeOutUp'
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
