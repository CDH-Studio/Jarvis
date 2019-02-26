export function notify ($, message, x = 10, y = 10) {
	$.notify({
		message: message
	}, {
		type: 'success',
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
