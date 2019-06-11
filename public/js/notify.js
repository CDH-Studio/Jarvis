// export function notify ({
// 	$,
// 	message,
// 	type = 'success',
// 	x = 10,
// 	y = 10,
// 	from = 'top',
// 	align = 'right',
// 	url = '',
// 	enter = 'fadeInRight',
// 	exit = 'fadeOutUp',
// 	element = 'body',
// 	delay = 5000
// } = {}) {
// 	$.notify({
// 		message: message,
// 		url: url
// 	}, {
// 		element: element,
// 		type: type,
// 		animate: {
// 			enter: 'animated ' + enter,
// 			exit: 'animated ' + exit
// 		},
// 		placement: {
// 			from: from,
// 			align: align
// 		},
// 		offset: {
// 			x: x,
// 			y: y
// 		},
// 		spacing: 10,
// 		z_index: 1031,
// 		delay: delay
// 	});
// };

export function notify (
	$,
	message,
	type,
	x,
	y,
	from,
	align,
	url,
	enter,
	exit,
	element,
	delay) {
	$.notify({
		message: message,
		url: url ? url : ''
	}, {
		element: element ? element : 'body',
		type: type ? type : 'success',
		animate: {
			enter: 'animated ' + enter ? enter : 'fadeInRight',
			exit: 'animated ' + exit ? exit : 'fadeOutUp'
		},
		placement: {
			from: from ? from : 'top',
			align: align ? align : 'right'
		},
		offset: {
			x: x ? x : 10,
			y: y ? y : 10
		},
		spacing: 10,
		z_index: 1031,
		delay: delay ? delay : 5000
	});
};
