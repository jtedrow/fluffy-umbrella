d3.json("/summary/byweek").then((data) => {
    // Create a lookup table to sort and regroup the columns of data,
    // first by year, then by species:
var lookup = {};

function getData(year, species) {
    var byYear, trace;
    if (!(byYear = lookup[year]))
    {;
        byYear = lookup[year] = {};
    }
    // If a container for this year + species doesn't exist yet, then create one:
    if (!(trace = byYear[species])) {
        trace = byYear[species] = {
            x: [],
            y: [],
            id: [],
            text: [],
            marker: {
                size: []
            }
        };
    }   
    return trace;
}

    // Go through each row, get the right trace, and append the data:
for (var i = 0; i < data.length; i++) {
    var datum = data[i];
    var trace = getData(datum["SEASON YEAR"], datum.SPECIES);
    trace.text.push(datum.SPECIES);
    trace.id.push(datum.SPECIES);
    trace.x.push(datum.WEEK);
    trace.y.push(datum.Total);
    trace.marker.size.push(datum.Positive);
}

var test = [];

    // Get the group names:
var years = Object.keys(lookup);
for (i = 0; i < years.length; i++) {
    var testY = lookup[years[i]];
    console.log(testY);
}

    // In this case, every year includes every species, so we can just infer the mosType from the *first* year:
var firstYear = lookup[years[8]];
var mosType = Object.keys(firstYear);
    

    // Create the main traces, one for each species:
var traces = [];
for (i = 0; i < mosType.length; i++) {
    var data = firstYear[mosType[i]];
        
    console.log(data);

    // One small note. We're creating a single trace here, to which the frames will pass data for the different years. It's
    // subtle, but to avoid data reference problems, we'll slice the arrays to ensure we never write any new data into our
    // lookup table:
    traces.push({
        name: mosType[i],
        x: data.x.slice(),
        y: data.y,
        id: data.id.slice(),
        text: data.text.slice(),
        mode: 'markers',
        marker: {
            colorscale: "hot",
            size: data.marker.size,
            sizemode: 'diameter',
    //   sizeref: 200000
        }
    });
}
    
    // Create a frame for each year. Frames are effectively just traces, except they don't need to contain the *full* trace
    // definition (for example, appearance). The frames just need the parts the traces that change (here, the data).
var frames = [];
for (i = 0; i < years.length; i++) {
    frames.push({
        name: years[i],
        data: mosType.map(function (species) {
            return getData(years[i], species);
        })
    })
}

    // Now create slider steps, one for each frame. The slider executes a plotly.js API command (here, Plotly.animate).
var sliderSteps = [];
for (i = 0; i < years.length; i++) {
    sliderSteps.push({
        method: 'animate',
        label: years[i],
        args: [
            [years[i]], {
                mode: 'immediate',
                transition: {
                    duration: 300
                },
                frame: {
                    duration: 300,
                    redraw: false
                },
            }
        ]
    });
}

var layout = {
    xaxis: {
    title: 'Week Tested',
        range: [15, 45]
    },
    yaxis: {
        title: 'Total Mosquitos Tested',
        type: 'category',
        autorange: true
    },
    height: 550,
    showlegend: {
        itemsizing: "constant"
    },
    hovermode: 'closest',
    
    // We'll use updatemenus (whose functionality includes menus as well as buttons) to create a play button and a pause button.
    updatemenus: [{
        x: 0,
        y: 0,
        yanchor: 'top',
        xanchor: 'left',
        showactive: false,
        direction: 'left',
        type: 'buttons',
        pad: {
            t: 87,
            r: 10
        },
        buttons: [{
            method: 'animate',
            args: [null, {
                mode: 'immediate',
                fromcurrent: true,
                transition: {
                    duration: 300
                },
                frame: {
                    duration: 500,
                    redraw: false
                }
            }],
            label: 'Play'
        }, 
        {
            method: 'animate',
            args: [
                [null], {
                    mode: 'immediate',
                    transition: {
                        duration: 0
                    },
                    frame: {
                        duration: 0,
                        redraw: false
                    }
                }
            ],
            label: 'Pause'
        }]
    }],

    // Finally, add the slider and use `pad` to position it next to the buttons.
    sliders: [{
        pad: {
            l: 130,
            t: 55
        },
        currentvalue: {
            visible: true,
            prefix: 'Year:',
            xanchor: 'right',
            font: {
                size: 20,
                color: '#666'
            }
        },
        steps: sliderSteps
    }]
};


// Create the plot:
Plotly.plot('myDiv', {
    data: traces,
    layout: layout,
    config: {
        showSendToCloud: true
    },
    frames: frames,
}); 
});
