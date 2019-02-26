export function notify (message, $) {
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
			x: 10,
			y: 60
		},
		spacing: 10,
		z_index: 1031
	});
};
