d3.json("/summary/").then((data) => {
    console.log(data.Pos)

    var trace1 = {
        x: data.Year,
        y: data.Pos,
        name: 'Positives',
        type: 'bar'
    };

    var trace2 = {
        x: data.Year,
        y: data.Neg,
        name: 'Negative',
        type: 'bar'
    };

    var data = [trace1, trace2];

    var layout = { barmode: 'stack' };

    Plotly.newPlot('barChart', data, layout);

});







