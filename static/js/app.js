function init() {
    // Grab a reference to the dropdown select element
    var selectorWard = d3.select("#selWard");
    var selectorYear = d3.select("#selYear");

    selectorWard
        .append("option")
        .text("-")
        .property("value", "-");

    selectorYear
        .append("option")
        .text("-")
        .property("value", "-");

    // Use the list of sample names to populate the select options
    d3.json("/names").then((d) => {
        let wards = d[4]["Wards"]
        let years = d[0]["SEASON YEAR"].sort()
        wards.forEach((ward) => {
            selectorWard
                .append("option")
                .text(ward)
                .property("value", ward);
        });
        years.forEach((year) => {

            selectorYear
                .append("option")
                .text(year)
                .property("value", year);
        });
        // Use the first sample from the list to build the initial plots
        buildCharts(2)
        buildPie(2019)

    });


}

function buildCharts(sample) {

    d3.json(`/ward/${sample}`).then((data) => {
        let years = [...new Set(data.map(x => x["SEASON YEAR"]))].sort();
        let positives = [];
        let negatives = [];

        years.forEach(y => {
            let filtered = data.filter(x => x["SEASON YEAR"] === y);
            let pos_filtered = filtered.filter(x => x.RESULT == "positive");
            let neg_filtered = filtered.filter(x => x.RESULT == "negative");

            positives.push(pos_filtered.length);
            negatives.push(neg_filtered.length);
        })

        var trace1 = {
            x: years,
            y: positives,
            name: 'Positive',
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
            x: years,
            y: negatives,
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

        var layout2 = {
            title: `Ward ${sample} Results by Year`,
            barmode: 'stack',
            plot_bgcolor: 'rgb(239,236,234)',
            paper_bgcolor: 'rgb(239,236,234)',
            yaxis: {
                title: 'Total Traps Tested',
            }
        };

        Plotly.newPlot('wardBarChart', data, layout2);

    })
};

function buildPie(sample) {
    d3.json(`/year/${sample}`).then((data) => {
        panel = d3.select("#pieChart");
        panel.html("")

        let uniqueTypes = [...new Set(data.map(x => x["SPECIES"]))].sort();
        let diction = []



        uniqueTypes.forEach(type => {
            let dict = {
                Type: type,
                Count: data.filter(x => x.SPECIES == `${type}`).length
            }
            diction.push(dict)
        });


        let chart = [{
            values: diction.map(x => x.Count),
            labels: diction.map(x => x.Type),
            type: 'pie'
        }];

        var layout = {
            title: `Distribution by Species: ${sample}`,
            plot_bgcolor: 'rgb(239,236,234)',
            paper_bgcolor: 'rgb(239,236,234)'
        }

        Plotly.newPlot('pieChart', chart, layout);
    })
};

buildPie(2019)
init()

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
        name: 'Positive',
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
        barmode: 'stack',
        plot_bgcolor: 'rgb(239,236,234)',
        paper_bgcolor: 'rgb(239,236,234)',
        yaxis: {
            title: 'Total Traps Tested',
        }
    };

    Plotly.newPlot('barChart', data, layout);

});








