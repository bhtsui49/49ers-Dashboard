const JSONFileName = 'assets/sfdata.json';
var index = 0;
var records;
var date;
var data;

['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    document.getElementById('sharedGrid').addEventListener(
        eventType,
        function (e) {
            var chart,
                point,
                i,
                event;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);
                index = point.index;
                point = chart.series[0].searchPoint(event, true);
                document.getElementById('yer').innerHTML = data['Year'][index];
                document.getElementById('rec').innerHTML = records[index];
                document.getElementById('divfin').innerHTML = data['DivFin'][index];
                document.getElementById('finish').innerHTML = data['finish'][index];
                document.getElementById('coachname').innerHTML = data['coaches'][index];
                document.getElementById('qbname').innerHTML = data['qbs'][index];
                document.getElementById('mvp').innerHTML = data['mvp'][index];
                document.getElementById('rush').innerHTML = data['rush'][index];
                document.getElementById('receive').innerHTML = data['receive'][index];
                var imgsrc = 'assets/' + data['coaches'][index] + '.jpg';
                var qbimgsrc = 'assets/' + data['qbs'][index] + '.jpg';
                var trophsrc = 'assets/' + data['trophies'][index] + 'troph.jpg';
                document.getElementById("coachpic").src = imgsrc;
                document.getElementById("qbpic").src = qbimgsrc;
                document.getElementById("trophy").src = trophsrc;
                if (point) {
                    point.highlight(e);
                };
                renderPolarChart(index);
            }
        }
    );
});

function renderPolarChart(index) {
  if (data['Off_Pts'][index] < data['outof'][index]/2) {
    var op = "#4f9642"
  } else if (data['Off_Pts'][index] < data['outof'][index]/2) {
    var op = "black"
  } else {
    var op = "red"
  }
  if (data['Off_Yds'][index] <= data['outof'][index]/2) {
    var oy = "#4f9642"
  } else if (data['Off_Yds'][index] < data['outof'][index]/2) {
    var oy = "black"
  } else {
    var oy = "red"
  }
  if (data['Def_Pts'][index] <= data['outof'][index]/2) {
    var dp = "#4f9642"
  } else if (data['Def_Pts'][index] < data['outof'][index]/2) {
    var dp = "black"
  } else {
    var dp = "red"
  }
  if (data['Def_Yds'][index] <= data['outof'][index]/2) {
    var dy = "#4f9642"
  } else if (data['Def_Yds'][index] < data['outof'][index]/2) {
    var dy = "black"
  } else {
    var dy = "red"
  }
  if (data['turn'][index] <= data['outof'][index]/2) {
    var tu = "#4f9642"
  } else if (data['turn'][index] < data['outof'][index]/2) {
    var tu = "black"
  } else {
    var tu = "red"
  }
  Highcharts.chart('polar', {
    chart: {
      margin: [50, 0, 0, 0],
      polar: true,
      type: "line",
      backgroundColor: '#ffffff',
      plotBorderWidth: 0,
      plotShadow: false,
    },
    title: {
      text: "Ranks Amongst League out of " + data['outof'][index] +', ' + data['Year'][index],
      style: {
        fontSize: '16px'
      }
    },
    pane: {
        size: '100%'
    },
    legend: {
      align: "right",
      layout: 'vertical',
    },
    xAxis: {
        categories: ['Offensive Points', 'Offensive Yards', 'Defensive Points', 'Defensive Yards',
            'Turnover Ratio'],
        tickmarkPlacement: 'on',
        lineWidth: 0
    },
    yAxis: {
        reversed: true,
        min: 1,
        max: data['outof'][index],
        tickInterval: 5,
        startOnTick: true,
        endOnTick: true,
        maxPadding: 0
    },
    plotOptions: {
        series: {
          lineWidth: 3,
          animation: false
        },
    },
    tooltip: {
      formatter: function () {
        return this.y;
      },
    },
    series: [{
        name: '49ers',
        color: "#B3995D",
        data: [
            {y: data['Off_Pts'][index], color: op},
            {y: data['Off_Yds'][index], color: oy},
            {y: data['Def_Pts'][index], color: dp},
            {y: data['Def_Yds'][index], color: dy},
            {y: data['turn'][index], color: tu}
        ],
        pointPlacement: 'on'
    },
    {
        name: 'League Average ' + '(' + data['outof'][index]/2 + ')',
        color: "black",
        data: [
            data['outof'][index]/2,
            data['outof'][index]/2,
            data['outof'][index]/2,
            data['outof'][index]/2,
            data['outof'][index]/2
        ],
        enableMouseTracking: false,
        pointPlacement: 'on'
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    align: 'center',
                    verticalAlign: 'center'
                },
                pane: {
                    size: '100%'
                }
            }
        }]
    }
  });
};
/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

function onSuccessCb(csvData) {
  records = csvData[0]["records"];
  data = csvData[0];
  Highcharts.chart('record', {
    chart: {
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20,
      backgroundColor: '#ffffff',
      height: 275,
      width: 600,
      type: 'line',
    },
    title: {
      text: 'Wins/ Total Games Played',
      align: 'left',
      margin: 0,
      style: {
        fontSize: 14
      }
    },
    legend: {
        enabled: false
    },
    xAxis: {
      plotBands: [{ // mark the weekend
            color: '#B3995D',
            from: 1981,
            to: 1996
      }],
      crosshair: {
        width: 2,
        color: '#c49191'
      }
    },
    yAxis: {
      gridLineDashStyle: 'Dot',
      gridLineColor: '#bfbfbf',
    },
    tooltip: {
        formatter: function () {
          return 'Win Percentage: ' + this.y*100 + '%';
        },
        positioner: function () {
            return {
                // right aligned
                x: this.chart.chartWidth - this.label.width,
                y: 10 // align to title
            };
        },
        borderWidth: 0,
        backgroundColor: '#ffffff',
        headerFormat: '',
        shadow: false,
        style: {
            fontSize: '10px'
        }
    },
    plotOptions: {
        series: {
            pointStart: 1967,
            color:'#AA0000'
        },
        animations: false
    },
    series: [{
      name: 'Win%',
      data: csvData[0]['Win%']
    }]
  });
  var chart = new Highcharts.chart('PFPA', {
    chart: {
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20,
      backgroundColor: '#ffffff',
      height: 275,
      width: 600,
      type: 'line',
    },
    title: {
      text: 'Points For and Against',
      align: 'left',
      margin: 0,
      style: {
        fontSize: 14
      }
    },
    xAxis: {
      plotBands: [{ // mark the weekend
            color: '#B3995D',
            from: 1981,
            to: 1996
      }],
      crosshair: {
        width: 2,
        color: '#c49191'
      }
    },
    yAxis: {
      gridLineDashStyle: 'Dot',
      gridLineColor: '#bfbfbf',
    },
    tooltip: {
        formatter: function () {
          return 'Point Differential: ' + (this.points[0].y - this.points[1].y);
        },
        positioner: function () {
            return {
                // right aligned
                x: this.chart.chartWidth - this.label.width,
                y: 10 // align to title
            };
        },
        borderWidth: 0,
        backgroundColor: '#ffffff',
        headerFormat: '',
        shadow: false,
        shared: true,
        style: {
            fontSize: '10px'
        }
    },
    plotOptions: {
      series: {
          pointStart: 1967
      },
      animation: false
    },
    series: [{
      type: 'line',
      name: 'Points For',
      color: '#4f9642',
      data: csvData[0]['PF']
    },
    {
      type: 'line',
      name: 'Points Against',
      color: 'red',
      data: csvData[0]['PA']
    },
  ]
  });
  renderPolarChart(0);
}
function fetchJSONFile(filePath, callbackFunc) {
    console.debug("Fetching file:", filePath);
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200 || httpRequest.status === 0) {
                console.info("Loaded file:", filePath);
                var data = JSON.parse(httpRequest.responseText);
                console.debug("Data parsed into valid JSON!");
                console.debug(data);
                if (callbackFunc) callbackFunc(data);
            } else {
                console.error("Error while fetching file", filePath,
                    "with error:", httpRequest.statusText);
            }
        }
    };
    httpRequest.open('GET', filePath);
    httpRequest.send();
}

function doMain() {
    fetchJSONFile('assets/sfdata.json', onSuccessCb);
}

document.onload = doMain();
