(function() {
    function setTotal() {
        $('#total').text(total);
    }

    function resetTotal() {
        total = 0;
    }

    function setStartDate(interval) {
        return moment().subtract(interval, 'days').format('YYYY-MM-DD');
    }

    function drawTable() {
        resetTotal();
        table.draw();
        setTotal();
    }

    var startDate = setStartDate(7);
    var typeFilter = '';
    var table;
    var total = 0;
    var username = '';

    $(document).ready(function() {
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                var date = data[2];
                var type = data[1];
                var user = data[0];

                var condition = date > startDate && 
                    (typeFilter === ''? true : (type === typeFilter)) && 
                    (user.toLowerCase().includes(username.toLowerCase()));
                
                if (condition) {
                    total++;  
                }
        
                return condition;
            }
        ); 

        table = $('#searchRecordsTable').DataTable({
            "paging":   true,
            "order": [[ 2, "desc" ]],
            "bLengthChange": false,
            "bInfo": false
        });
    });

    //= ========================================================================
    // Search type filter
    //= ========================================================================
    $('#dropdownType-All').on('click', function() {
        $('#dropdownType').text('All');

        typeFilter = '';
        drawTable();
    })

    $('#dropdownType-Fixed').on('click', function() {
        $('#dropdownType').text('Fixed');

        typeFilter = 'fixed';
        drawTable();
    })

    $('#dropdownType-Flexible').on('click', function() {
        $('#dropdownType').text('Flexible');

        typeFilter = 'flexible';
        drawTable();
    })

    //= ========================================================================
    // Time filter
    //= ========================================================================
    $('#dropdownTime-7d').on('click', function() {
        $('#dropdownTime').text('7 days');

        startDate = setStartDate(7);
        drawTable();
    })

    $('#dropdownTime-30d').on('click', function() {
        $('#dropdownTime').text('30 days');

        startDate = setStartDate(30);
        drawTable();
    })

    $('#dropdownTime-60d').on('click', function() {
        $('#dropdownTime').text('60 days');

        startDate = setStartDate(60);
        drawTable();
    })

    $('#dropdownTime-180d').on('click', function() {
        $('#dropdownTime').text('180 days');

        startDate = setStartDate(180);
        drawTable();
    })

    //= ========================================================================
    // User filter
    //= ========================================================================
    $('#user').keyup(function() {
        username = $('#user').val();
        drawTable();
    })
})();