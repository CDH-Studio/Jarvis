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
            $('#to').datetimepicker('date', e.date.add(0.5, 'hour').format('HH:mm'));
    });

    $('#to').datetimepicker({
        format: 'HH:mm',
        stepping: 30,
        defaultDate: moment(round(moment()), 'HH:mm').add(0.5, 'h')
    });

    $('#fixed-search-from').datetimepicker({
        format: 'HH:mm',
        stepping: 30,
        defaultDate: moment(round(moment()), 'HH:mm')
    });

    $('#fixed-search-from').on("change.datetimepicker", function (e) {
        if($('#fixed-search-to').datetimepicker('date').isSameOrBefore(e.date))
            $('#fixed-search-to').datetimepicker('date', e.date.add(0.5, 'hour').format('HH:mm'));
    });

    $('#fixed-search-to').datetimepicker({
        format: 'HH:mm',
        stepping: 30,
        defaultDate: moment(round(moment()), 'HH:mm').add(0.5, 'h')
    });

    $('#flexible-search-from').datetimepicker({
        format: 'HH:mm',
        stepping: 30,
        defaultDate: moment(round(moment()), 'HH:mm')
    });

    $('#flexible-search-from').on("change.datetimepicker", function (e) {
        if($('#flexible-search-to').datetimepicker('date').isSameOrBefore(e.date))
            $('#flexible-search-to').datetimepicker('date', e.date.add(0.5, 'hour').format('HH:mm'));
    });

    $('#flexible-search-to').datetimepicker({
        format: 'HH:mm',
        stepping: 30,
        defaultDate: moment(round(moment()), 'HH:mm').add(0.5, 'h')
    });
});