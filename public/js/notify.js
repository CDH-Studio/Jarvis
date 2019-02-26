export function notify ({
	$,
	message,
	type = 'success',
	x = 10,
	y = 10,
	from = 'top',
	align = 'right'
} = {}) {
	$.notify({
		message: message
	}, {
		type: type,
		animate: {
			enter: 'animated fadeInRight',
			exit: 'animated fadeOutUp'
		},
		placement: {
			from: 'top',
			align: 'right'
		},
		offset: {
			x: x,
			y: y
		},
		spacing: 10,
		z_index: 1031
	});
};
