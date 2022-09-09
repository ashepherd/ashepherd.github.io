const columnDefs = [
    {
        colId: 'movie',
        headerName: 'Movies',
        children:[
            {
                colId: 'poster',
                headerName: 'Poster', 
                field: 'thumbnail', 
                type: 'rightAligned',
                suppressSizeToFit: true,
                cellRenderer: params => {
                    var url = './data/thumbnails/' + params.value;
                    var summary = "";
                    if (null != params.data.summary) {
                        summary = params.data.summary;
                    }
                    return '<div align="center"><a href="' + url + '" target="_blank"><img class="thumbnail" src="' + url + '" title="' + summary + '"/></a><br/><span>' + params.data.year + '</span></div>';
                }
            },
            {
                colId: 'title',
                headerName: 'Title',
                field: 'title', 
                width: 500,
                comparator: titleComparator,
                getQuickFilterText: params => {
                    var value = params.value.name + ' ' + params.data.tagline;
                    if (null != params.data.summary) {
                        value += ' ' + params.data.summary;
                    }
                    if (null != params.data.directors && params.data.directors.length > 0) {
                        value +=  params.data.directors.map(function(elem){ return elem.name; }).join(",")
                    }
                    if (null != params.data.writers && params.data.writers.length > 0) {
                        value +=  params.data.writers.map(function(elem){ return elem.name; }).join(",")
                    }
                    if (null != params.data.producers && params.data.producers.length > 0) {
                        value +=  params.data.producers.map(function(elem){ return elem.name; }).join(",")
                    }
                    if (null != params.data.roles && params.data.roles.length > 0) {
                        value +=  params.data.roles.map(function(elem){ var str = elem.name; if (null != elem.role) { str += ' (' + elem.role + ')'; } return str; }).join(",")
                    }
                    return value;
                },
                cellRenderer: params => {
                    var value = '<strong>' + params.data.title + '</strong>';
                    if (null != params.data.tagline) {
                        value += '<br/><em>' + params.data.tagline + '</em>';
                    }
                    if (null != params.data.summary) {
                        value += '</br><span>' + params.data.summary + '</span></br>';
                    }
                    var item_key = params.data.key.replace(/^[^a-z]+|[^\w:.-]+/gi, "-");
                    value += '<div class="more-details-link" id="' + item_key + '-more"> ' + 
                        '<a href="#" class="more-link" onclick="itemDetails(\'' + item_key  +'\');">[<span>more</span>]</a></div>' + 
                    '<div class="more-details" id="' + item_key+ '-details">';
                    if (null != params.data.directors && params.data.directors.length > 0) {
                        value += '</br><strong>Director:</strong> ' + params.data.directors.map(
                            function(elem){ return elem.name; }).join(",") + '</br>';
                    }
                    if (null != params.data.roles && params.data.roles.length > 0) {
                        const actors = params.data.roles.slice(0, 10);
                        value += '</br><strong>Actors:</strong> ' + actors.map(
                            function(elem){ var str = elem.name; if (null != elem.role) { str += ' (' + elem.role + ')'; } return str; }).join(",");
                    }
                    if (null != params.data.writers && params.data.writers.length > 0) {
                        value += '</br><strong>Writers:</strong> ' + params.data.writers.map(
                            function(elem){ return elem.name; }).join(",");
                    }
                    if (null != params.data.producers && params.data.producers.length > 0) {
                        value += '</br><strong>Producers:</strong> ' + params.data.producers.map(
                            function(elem){ return elem.name; }).join(",");
                    }
                    value += '</div>';
                    return value;
                }
            },
            {
                colId: 'date_added',
                headerName: 'Date Added',
                field: 'dateAdded.label', 
                comparator: dateComparator,
                filter: 'agDateColumnFilter', 
                filterParams: dateFilter, 
                width: 150,
                columnGroupShow: 'open',
                cellRenderer: params => {
                    var date = new Date(params.data.dateAdded.label);
                    return date.toLocaleDateString();
                }
            },
            {
                colId: 'rating',
                headerName: 'Rating',
                field: 'rating', 
                width: 100,
                suppressSizeToFit: true,
                columnGroupShow: 'open',
                comparator: ratingComparator,
                filterParams: {
                    comparator: ratingComparator,
                    buttons: ['reset', 'apply']
                }
            },
            {
                colId: 'runtime',
                headerName: 'Runtime',
                field: 'runtime.label', 
                width: 150,
                suppressSizeToFit: true,
                columnGroupShow: 'open',
                comparator: runtimeComparator
            },
            {
                colId: 'genre',
                headerName: 'Genre',
                field: 'genres', 
                columnGroupShow: 'open',
                suppressSizeToFit: true,
                width: 200,
            }
        ]
    }
    /*,
    {   
        colId: 'date',
        headerName: 'Date', 
        marryChildren: true,
        children:[
            {
                colId: 'year',
                headerName: 'Year', 
                field: 'year', 
                filter: 'agNumberColumnFilter',
                width: 120,
                suppressSizeToFit: true,
                comparator: yearComparator,
                
            },
            {
                colId: 'release_date',
                headerName: 'Release Date',
                field: 'release_date.label', 
                comparator: dateComparator,
                filter: 'agDateColumnFilter', 
                filterParams: dateFilter, 
                width: 150,
                suppressSizeToFit: true
            },
            {
                colId: 'date_added',
                headerName: 'Date Added',
                field: 'dateAdded.label', 
                comparator: dateComparator,
                filter: 'agDateColumnFilter', 
                filterParams: dateFilter, 
                width: 150,
                columnGroupShow: 'open',
                cellRenderer: params => {
                    var date = new Date(params.data.dateAdded.label);
                    return date.toLocaleDateString();
                }
            }
        ]
    }
    */
];

const gridOptions = {
    defaultColDef: {
        flex: 1,
        filter: true,
        filterParams: {
            buttons: ['reset', 'apply']
        },
        resizable: true,
        rowHeight: 100,
        sortable: true,
        wrapText: true, 
        autoHeight: true, 
    },
    columnDefs: columnDefs,
    getRowHeight: params => 100,
    onFirstDataRendered: headerHeightSetter,
    onColumnResized: headerHeightSetter,
    onGridReady: onGridReady,
    pagination: false
};

const eGridDiv = document.querySelector('#myGrid');

new agGrid.Grid(eGridDiv, gridOptions);

fetch('./data/library.json').then(function (response) {
    return response.json();
}).then(function (data) {
    gridOptions.api.setRowData(data);
    setTotal(gridOptions.api.getDisplayedRowCount())

    /* GENRES */
    let i = 0;
    genres = []
    const select = document.querySelector('#genre-select');
    while (i < data.length) {
        let j = 0;
        while (j < data[i]['genres'].length) {
            if (!genres.includes(data[i]['genres'][j])) {
                genres.push(data[i]['genres'][j]);
            }
            j++;
        }
        i++;
    }
    genres.sort();
    i = 0;
    while (i < genres.length) {
        let newOption = new Option('  ' + genres[i] + '  ',genres[i]);
        select.add(newOption,undefined);
        i++;
    }
    $('select#genre-select').select2();
})

var resetButton = document.querySelector('#reset-button');
var searchButton = document.querySelector('#search-button');
var searchInput = document.querySelector('#search-input');
let genreSelect = document.querySelector('#genre-select');

function setTotal(count) {
    document.querySelector('#item-count').innerHTML = count;
}

function selectGenre(select2_data) {
    let genres = select2_data.map(function(elem){ return elem.id; })
    let model = {}   
    if (genres.length > 1) {
        model = { filterType: 'text', operator: 'AND' }
        let i = 0;
        while (i < genres.length) {
            i++;
            let cond = 'condition' + i;
            model[cond] = {
                filterType: 'text',
                type: 'contains',
                filter: genres[i-1]
            }
        }
    }
    else if (genres.length == 1) {
        model = {
            filterType: 'text',
            type: 'contains',
            filter: genres[0]
        }
    }
    
    gridOptions.api.getFilterInstance('genre').setModel(model);
    gridOptions.api.onFilterChanged();
    setTotal(gridOptions.api.getDisplayedRowCount())
}
document.addEventListener("DOMContentLoaded", () => {
    
    $('#genre-select').on('select2:select', function (e) {
        selectGenre($('#genre-select').select2('data'))
    });
    $('#genre-select').on('select2:unselect', function (e) {
        selectGenre($('#genre-select').select2('data'))
    });
    resetButton.addEventListener("click", function(){ 
        gridOptions.api.setQuickFilter('');
        setTotal(gridOptions.api.getDisplayedRowCount())
        searchInput.value = '';
    });
    searchButton.addEventListener("click", function(){
        gridOptions.api.setQuickFilter(searchInput.value);
        setTotal(gridOptions.api.getDisplayedRowCount())
    });
    searchInput.addEventListener("keyup", function(event) {
        if (event.key === 'Enter') {
            gridOptions.api.setQuickFilter(searchInput.value);
            setTotal(gridOptions.api.getDisplayedRowCount())
        }
    });
});