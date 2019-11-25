function setTotal(table) {
    $('#total').text(table.$('tr', {"filter":"applied"}).length);
}

function setStartDate(interval) {
    return moment().subtract(interval, 'days').format('YYYY-MM-DD');
}

var startDate = setStartDate(7);

$(document).ready(function() {
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            var date = data[2]; // use data for the age column
            console.log('date ', date)

            return date > startDate;
        }
    ); 

    $('#searchRecordsTable').DataTable( {
        "paging":   true,
        "columnDefs": [ { type: 'date', 'targets': [3] } ],
        "order": [[ 3, "desc" ]],
        "info":     false
    });

    console.log(startDate);
});

$('#menu1-item1').on('click', function() {
    $('#dropdown1').text('All');

    var table = $('#searchRecordsTable').DataTable()
        .columns(1)
        .search('');
    table.draw();

    setTotal(table);
})

$('#menu1-item2').on('click', function() {
    $('#dropdown1').text('Fixed');

    var table = $('#searchRecordsTable').DataTable()
        .columns(1)
        .search('fixed');
    table.draw();
    
    setTotal(table);
})

$('#menu1-item3').on('click', function() {
    $('#dropdown1').text('Flexible');

    var table = $('#searchRecordsTable').DataTable()
        .columns(1)
        .search('flexible');
    table.draw();
    
    setTotal(table);
})

$('#menu2-item1').on('click', function() {
    $('#dropdown2').text('7 days');
    startDate = setStartDate(1);

    var table = $('#searchRecordsTable').DataTable()
        .columns(1)
        .search('flexible');
    table.draw();
})

$('#menu2-item2').on('click', function() {
    $('#dropdown2').text('30 days');
    startDate = setStartDate(30);

    var table = $('#searchRecordsTable').DataTable()
        .columns(1)
        .search('flexible');
    table.draw();
})