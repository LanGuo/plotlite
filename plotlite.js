
/*
This function parses PlotLite format strings and output plotly format strings.
PlotList format guide:
The first line should start with a chart type keyword, followed by the chart title.
The second line starts with the xData keyword, followed by data to be plotted on the x-axis.
The third line starts with the yData keyword, followed by data to be plotted on the y-axis.
For chart type, currently supporting scatter, bar plots.

*/

function parsePlotLine(plotLine) {
  const plotLineEndOfType = plotLine.indexOf(' ');
  const plotType = plotLine.slice(0, plotLineEndOfType);
  const plotTitle = plotLine.slice(plotLineEndOfType + 1).trim();
  return {
    plotType: plotType,
    plotTitle: plotTitle
  };
}

function parseData(dataLine) {
  let dim = dataLine.match(/[xyz](?=Data)/); // matches x,y,or z followed by 'Data'
  let data = dataLine.match(/[-*.*0-9]+|\s(?=,)/g); // globally matches any signed or unsigned numbers and spaces followed by ','
  if (!dim) {
    data = null;
  }
  return {
    dim: dim,
    data: data
  };
}

function parsePlotlite(input) {
  let plotType = null;
  let plotTitle = '';
  let dataObject = {};
  let errorMessage = '';
  let numLines = 0;
  let lines;

  if (!input) {
    errorMessage = 'Please input PlotLite code.';
  }
  else {
    lines = input.split('\n');
    numLines = lines.length;
  }
  if (numLines < 3 && numLines > 0) {
    errorMessage = 'Insuffient inputs. Please refer to format guide for input formatting!';
  }
  else if (numLines >= 3) {
    const plotLine = lines[0];
    ({plotType, plotTitle} = parsePlotLine(plotLine));
    if (plotType !== 'scatter' && plotType !== 'bar') {
      errorMessage = 'Undefined chart type! Supported chart types: scatter, bar.';
      plotType = null;
    }
  }
  if (plotType !== null) {
    let dataLines = lines.slice(1); // an Array of lines(strings) containing data
    dataLines = dataLines.filter(entry => entry.trim() !== ''); // throw away empty lines
    for (let dataLine of dataLines) {
      // dim stores the dimension of the data, e.g. 'x' or 'y'
      let {dim, data} = parseData(dataLine);
      if (!dim || !data) {
        errorMessage = 'Please provide xData and yData for plotting.';
      }
      else {
        dataObject[dim] = data;
      }
    }
  }
  return {
    plotType: plotType,
    plotTitle: plotTitle,
    dataObject: dataObject,
    errorMessage: errorMessage
  };
}

function generatePlotlyPlot(plotType, plotTitle, dataObject, outputDiv) {
  const xData = dataObject.x;
  const yData = dataObject.y;

  var layout = {
    title: plotTitle,
    autosize: true,
    width: 500,
    height: 300,
    margin: {
      t: 100, b: 0, l: 0, r: 0
    }
  };
  /* global Plotly */
  Plotly.newPlot(outputDiv, [{
    x: xData,
    y: yData,
    type: plotType }],
    layout,
    {displayModeBar: false});
}

function plotliteToPlotly() {
  let input = document.getElementById('plotliteCode').value;
  let outputDiv = document.getElementById('plotly');
  let {plotType, plotTitle, dataObject, errorMessage} = parsePlotlite(input);
  if (errorMessage) {
    outputDiv.innerHTML = errorMessage;
  }
  else {
    generatePlotlyPlot(plotType, plotTitle, dataObject, outputDiv);
  }
}
