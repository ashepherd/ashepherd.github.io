function basicComparator(o1, o2) {
    // Now that both parameters are Date objects, we can compare
    if (o1 === null && o2 === null) {
        return 0;
    }
    if (o1 === null) {
        return -1;
    }
    if (o2 === null) {
        return 1;
    }
    return o1 - o2;
}

function dateValue(datestr) {
    return new Date(datestr);
}
function dateComparator(date1, date2, row1, row2) {
    return basicComparator(dateValue(date1), dateValue(date2));
}
function yearComparator(y1, y2, row1, row2) {
    if (null != row1.data.release_date && null != row2.data.release_date) {
        return basicComparator(row1.data.release_date.ordinal, row2.data.release_date.ordinal);
    } else {
        return basicComparator(y1, y2);
    }
    return basicComparator(dateValue(row1.data.release_date.label), dateValue(row2.data.release_date.label));
}

var dateFilter = { 
    browserDatePicker: true,
    buttons: ['reset', 'apply'],
    comparator: (filterDate, cellValue) => {
        //console.log(filterDate, cellValue);
        const cellDate = dateValue(cellValue);
        // Now that both parameters are Date objects, we can compare
        if (cellDate < filterDate) {
            return -1;
        } else if (cellDate > filterDate) {
            return 1;
        } else {
            return 0;
        }
    }
}
function ratingValue(rating) {
    if (rating == null) {
        return 100;
    }

    if (rating.startsWith('TV-')) {
        rating = rating.substring(3);
    }
    var value = 0;
    switch(rating) {
        case 'X':
            value = 1;
            break;
        
        case 'R':
            value = 2;
            break;
        case '14':
            value = 3;
            break;
        case 'PG-13':
            value = 4;
            break;
        case 'PG': 
            value = 5;
            break;
        case 'Passed': 
            value = 6;
            break;
        case 'Approved': 
            value = 7;
            break;
        case 'G': 
            value = 8;
            break;
        case 'Not Rated':
        default:
            value = 9;
            break;
    }
    return value;
}

function titleComparator(val1, val2, row1, row2) {
    t1 = row1.data.titleSort;
    t2 = row2.data.titleSort;
    return basicComparator(t1, t2);
}

function ratingComparator(val1, val2, row1, row2) {
    var r1 = ratingValue(val1);
    var r2 = ratingValue(val2);
    return basicComparator(r1, r2);
}

function runtimeComparator(r1, r2, row1, row2) {
    if (null != row1.data.runtime && null != row2.data.runtime) {
        return basicComparator(row1.data.runtime.duration, row2.data.runtime.duration);
    } else {
        return basicComparator(r1, r2);
    }
}

function headerHeightSetter() {
    var padding = 30;
    var height = headerHeightGetter() + padding;
    gridOptions.api.setHeaderHeight(height);
}

function headerHeightGetter() {
    var columnHeaderTexts = [
        ...document.querySelectorAll('.ag-header-cell-text'),
    ];
    var clientHeights = columnHeaderTexts.map(
        headerText => headerText.clientHeight
    );
    var tallestHeaderTextHeight = Math.max(...clientHeights);
    return tallestHeaderTextHeight;
}

function onGridReady(params) { 
    gridOptions.columnApi.applyColumnState({
        state: [
            {
                colId: 'date_added',
                sort: 'desc'
            }
        ],
        defaultState: {
            // important to say 'null' as undefined means 'do nothing'
            sort: null
        }
    });
    sizeToFit();
}

function sizeToFit() {

    gridOptions.api.sizeColumnsToFit({
        defaultMinWidth: 120,
        columnLimits: [
            { key: 'poster', minWidth: 150, maxWidth: 200 },
            /*{ key: 'title', minWidth: 700 },*/
            /*{ key: 'year', minWidth: 150 },*/
        ],
    });
}

function itemDetails(item) {
    var id = '#' + item;

    var more = id + '-more > a.more-link > span';
    var more_word = 'more';
    if (more_word == document.querySelector(more).innerHTML) {
        more_word = 'less';
    }
    document.querySelector(more).innerHTML = more_word;

    var details = id + '-details';
    var display_word = 'block';
    if (display_word == document.querySelector(details).style.display){
        display_word = 'none';
    }
    document.querySelector(details).style.display = display_word;
}