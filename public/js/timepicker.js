function round(date) {
    var duration = moment.duration(30, "minutes");
    var method = "ceil";
    return moment(Math[method]((+date) / (+duration)) * (+duration)); 
}

$(function () {
    $('#from').datetimepicker({
        format: 'HH:mm',
        stepping: 30,
        defaultDate: moment(round(moment()), 'HH:mm')
    });

    $('#from').on("change.datetimepicker", function (e) {
        if($('#to').datetimepicker('date').isSameOrBefore(e.date))
            $('#to').datetimepicker('date', e.date.add(1, 'hour').format('HH:mm'));
    });
});

$(function () {
    $('#to').datetimepicker({
        format: 'HH:mm',
        stepping: 30,
        defaultDate: moment(round(moment()), 'HH:mm').add(1, 'h')
    });
});