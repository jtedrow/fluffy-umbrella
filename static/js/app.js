d3.json("/summary/").then((data) => {
    year = []
    pos = []
    neg = []

    data.forEach(d => {
        year.push(d.Year);
        pos.push(d.Pos);
        neg.push(d.Neg);
    })


    var trace1 = {
        x: year,
        y: pos,
        name: 'Positives',
        type: 'bar',
        marker: {
            color: 'rgb(15,140,121)',
            line: {
                color: 'rgb(229,226,224)',
                width: 1
            }
        }
    };

    var trace2 = {
        x: year,
        y: neg,
        name: 'Negative',
        type: 'bar',
        marker: {
            color: 'rgb(189,45,40)',
            line: {
                color: 'rgb(229,226,224)',
                width: 1
            }
        }
    };

    var data = [trace1, trace2];

    var layout = {
        title: "West Nile Virus Results per Year",
        barmode: 'stack'
    };

    Plotly.newPlot('barChart', data, layout);

});






