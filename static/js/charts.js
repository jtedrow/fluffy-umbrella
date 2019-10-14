// d3.json("/summary/").then((data) => {
//     console.log(data.Pos)

    // build function to call on data from summary route and add in guagefunction
   d3.json("/summary/").then((data) => {
        const Year = data.Year
        const Pos = data.Pos
        const Neg = data.Neg

        // Build stacked bar chart
        var positiveResults = {
          x: Year,
          y: Pos,
          name: 'Positives',
          type: 'bar'
      };
  
      var negativeResults = {
          x: Year,
          y: Neg,
          name: 'Negative',
          type: 'bar'
      };
  
      var bardata = [positiveResults, negativeResults];
  
      var barlayout = { 
        barmode: 'stack', 
        title: 'West Nile Mosquitos',
        font:{
          family: 'Raleway, sans-serif'
        },
        // showlegend: false,
        xaxis: {
          tickangle: -45
        },
        yaxis: {
          zeroline: false,
          gridwidth: 2
        },
        bargap :0.05
    };
  
      Plotly.plot('barChart', bardata, barlayout);

      // Build bubble plot - need new route to call on other columns (wards, species, total tested mos, etc)

      var bubbleData = [
        {
          x: Year,
          y: Neg,
          text: Pos,
          mode: "markers",
          marker: {
            size: Pos,
            color: Year,
            colorscale: "Electric"
          }
        }
      ];
      
      var bubbleLayout = {
        margin: {t: 0},
        hovermode: "closest",
        xaxis: { title: "Year"}
      };

      Plotly.plot("bubble", bubbleData, bubbleLayout);

      // Add slider automation code:
d3.json("/summary/").then((data) => {
     // Create a lookup table to sort and regroup the columns of data, first by year, then by SPECIES:
  var lookup = {};
  function getData(SEASON_YEAR, SPECIES) {
    var byYear, trace;
    if (!(byYear = lookup[SEASON_YEAR])) 
    {;
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
        marker: {size: []}
      };
    }
    return trace;
  }
  
  // Go through each row and get the trace and append the data
  for (var i = 0; i < data.length; i++) {
    var datum = data[i];
    var trace = getData(datum.SEASON_YEAR, datum.SPECIES);
    trace.text.push(datum.Wards);
    trace.id.push(datum.Wards);
    trace.x.push(datum.WEEK);
    // need to update with total # of samples by week and need to call on samples route
    trace.y.push(datum.Neg);
    trace.marker.size.push(datum.Pos);
  }

      // Create a frame for each year
      var frames = [];
      for (i = 0; i < years.length; i++) {
        frames.push({
          name: years[i],
          data: SPECIES.map(function (SPECIES) {
            return getData(years[i], SPECIES);
          })
        })
      }
      
      // Get the group names:
      var years = Object.keys(lookup);
      var firstYear = lookup[years[0]];
      var SPECIES = Object.keys(firstYear);

      // Create the main traces, one for each Species:
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
          size: data.marker.size.slice(),
          sizemode: 'area',
          sizeref: 200000
        }
      });
    }
      // Create a frame for each year.
      var frames = [];
      for (i = 0; i < years.length; i++) {
        frames.push({
          name: years[i],
          data: continents.map(function (continent) {
        return getData(years[i], continent);
      })
    })
  }
   
      //create the slider steps 
      var sliderSteps = [];
      for (i = 0; i < years.length; i++) {
        sliderSteps.push({
          method: 'animate',
          label: years[i],
          args: [[years[i]], {
            mode: 'immediate',
            transition: {duration: 300},
            frame: {duration: 300, redraw: false},
          }]
        });
      }
      
      var layout = {
        xaxis: {
          title: 'Ward',
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
          pad: {t: 87, r: 10},
          buttons: [{
            method: 'animate',
            args: [null, {
              mode: 'immediate',
              fromcurrent: true,
              transition: {duration: 300},
              frame: {duration: 500, redraw: false}
            }],
            label: 'Play'
          }, {
            method: 'animate',
            args: [[null], {
              mode: 'immediate',
              transition: {duration: 0},
              frame: {duration: 0, redraw: false}
            }],
            label: 'Pause'
          }]
        }],

      // Add the slider and use 'pad' to position it next to the buttons
     sliders: [{
       pad: {l: 130, t: 55},
       currentvalue: {
         visible: true,
         prefix: 'Year:',
         xanchor: 'right',
         font: {size: 20, color: '#666'}
      },
      steps: sliderSteps
    }]
  };

      // Create the plot 
      Plotly.plot("slider", {
        data:bubbleData, 
        layout: bubbleLayout
        // frames: frames,
      });
    });
  });

// Build the guage reporting # of positive occuracnces by ward
  //buildGauge(Pos)