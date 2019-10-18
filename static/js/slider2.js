// Build bubble plot and add slider automation code:
d3.json("/summary/byweek").then((data) => {
    // Create a lookup table to sort and regroup the columns of data, first by year, then by SPECIES:
    var lookup = {};
    function getData(SEASON_YEAR, SPECIES) {
        var byYear, trace;
        if (!(byYear = lookup[SEASON_YEAR])) {
            ;
            byYear = lookup[SEASON_YEAR] = {};
        }
        // If a container for this year + SPECIES doesn't exist yet,
        // then create one:
        if (!(trace = byYear[SPECIES])) {
            trace = byYear[SPECIES] = {
                x: [],
                y: [],
                id: [],
                text: [],
                marker: { size: [] }
            };
        }
        return trace;
    }
    console.log(lookup)
    // Go through each row and get the trace and append the data
    for (var i = 0; i < data.length; i++) {
        var datum = data[i];
        var trace = getData(datum["SEASON YEAR"], datum.SPECIES);
        trace.text.push(datum.WEEK);
        trace.id.push(datum.WEEK);
        trace.x.push(datum.WEEK);
        trace.y.push(datum.Total);
        trace.marker.size.push(datum.Positive);
    }
    // console.log(trace.y);
    // Get the group names:
    var year = Object.keys(lookup);
    var firstYear = lookup[year[0]];
    var SPECIES = Object.keys(firstYear);
    // Create the main traces, one for each SPECIES:
    var traces = [];
    for (i = 0; i < SPECIES.length; i++) {
        var data = firstYear[SPECIES[i]];
        // Slice the arrays to avoid data reference problems and avoid never write any new data into our lookup table:
        traces.push({
            name: SPECIES[i],
            x: data.x.slice(),
            y: data.y.slice(),
            id: data.id.slice(),
            text: data.text.slice(),
            mode: 'markers',
            marker: {
                size: 10,
                sizemode: 'area',
                // sizeref: 200000
            }
        });
    }
    // Create a frame for each year
    var frames = [];
    for (i = 0; i < year.length; i++) {
        frames.push({
            name: year[i],
            data: SPECIES.map(function (SPECIES) {
                return getData(year[i], SPECIES);
            })
        })
    }
    //create the slider steps
    var sliderSteps = [];
    for (i = 0; i < year.length; i++) {
        sliderSteps.push({
            method: 'animate',
            label: year[i],
            args: [[year[i]], {
                mode: 'immediate',
                transition: { duration: 300 },
                frame: { duration: 300, redraw: false },
            }]
        });
    }
    var layout = {
        xaxis: {
            title: 'Week Tested',
            range: [20, 40]
        },
        yaxis: {
            title: 'Mosquitoes Tested',
            type: 'log'
        },
        hovermode: 'closest',
        // Create Play and Pause Button using updatemenus
        updatemenus: [{
            x: 0,
            y: 0,
            yanchor: 'top',
            xanchor: 'left',
            showactive: false,
            direction: 'left',
            type: 'buttons',
            pad: { t: 87, r: 10 },
            buttons: [{
                method: 'animate',
                args: [null, {
                    mode: 'immediate',
                    fromcurrent: true,
                    transition: { duration: 300 },
                    frame: { duration: 500, redraw: false }
                }],
                label: 'Play'
            }, {
                method: 'animate',
                args: [[null], {
                    mode: 'immediate',
                    transition: { duration: 0 },
                    frame: { duration: 0, redraw: false }
                }],
                label: 'Pause'
            }]
        }],
        // Add the slider and use 'pad' to position it next to the buttons
        sliders: [{
            pad: { l: 130, t: 55 },
            currentvalue: {
                visible: true,
                prefix: 'Year:',
                xanchor: 'right',
                font: { size: 20, color: '#666' }
            },
            steps: sliderSteps
        }]
    };
    // Create the plot
    Plotly.plot("sliderChart", {
        data: traces,
        layout: layout,
        frames: frames,
    });
});