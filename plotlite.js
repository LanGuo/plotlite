
/*
PlotLite is a declarative ploting language that aims to simplify the making of interactive plots. This script translates PlotLite code to plotly.js. 
PlotLite format guide:
The first line should start with a chart type keyword, followed by the chart title.
The second line starts with the xData keyword, followed by data to be plotted on the x-axis.
The third line starts with the yData keyword, followed by data to be plotted on the y-axis.
For chart type, currently supporting scatter, bar plots.
*/

// function to parse plot type and plot title line.
function parsePlotLine(plotLine) {
  const plotLineEndOfType = plotLine.indexOf(' ');
  const plotType = plotLine.slice(0, plotLineEndOfType);
  const plotTitle = plotLine.slice(plotLineEndOfType + 1).trim();
  return {plotType: plotType, plotTitle: plotTitle};
}

// function to parse x/y/zData line.
function parseData(dataLine) {
  const dim = dataLine.match(/[xyz](?=Data)/); // matches x,y,or z followed by 'Data'
  const data = dataLine.match(/[-*.*0-9]+|\s(?=,)/g); // globally matches any signed or unsigned numbers and spaces followed by ','
  if (!dim) {
    return {dim: null, data: null};
  }
  if (!data) {
    return {dim: dim, data: null};
  }

  return {dim: dim, data: data};
}

// function that parses PlotLite code to get variables needed for a plotly plot.
function parsePlotlite(input) {
  let plotType = '',
    plotTitle = '',
    dataObject = {},
    errorMessage = '';

  if (!input) {
    errorMessage = 'Please input PlotLite code.';
    return {
      plotType: plotType,
      plotTitle: plotTitle,
      dataObject: dataObject,
      errorMessage: errorMessage
    };
  }

  const lines = input.split('\n');
  const numLines = lines.length;
  if (numLines < 3) {
    errorMessage = 'Insuffient inputs. Please refer to format guide for input formatting!';
    return {
      plotType: plotType,
      plotTitle: plotTitle,
      dataObject: dataObject,
      errorMessage: errorMessage
    };
  }

  const plotLine = lines[0];
  ({plotType, plotTitle} = parsePlotLine(plotLine));

  if (plotType !== 'scatter' && plotType !== 'bar') {
    errorMessage = 'Undefined chart type! Supported chart types: scatter, bar.';
    return {
      plotType: plotType,
      plotTitle: plotTitle,
      dataObject: dataObject,
      errorMessage: errorMessage
    };
  }

  let dataLines = lines.slice(1); // an Array of lines(strings) containing data
  dataLines = dataLines.filter(entry => entry.trim() !== ''); // throw away empty lines

  for (let dataLine of dataLines) {
    let dim, data; // dim stores the dimension of the data, e.g. 'x' or 'y'
    ({dim, data} = parseData(dataLine));
    // console.log(dim, data);
    if (!dim || !data) {
      errorMessage = 'Please provide xData and yData for plotting.';
      return {
      plotType: plotType,
      plotTitle: plotTitle,
      dataObject: dataObject,
      errorMessage: errorMessage
      };
    }
    else {
      dataObject[dim] = data;
    }
  }

  return {
      plotType: plotType,
      plotTitle: plotTitle,
      dataObject: dataObject,
      errorMessage: errorMessage
    };
}

// function that calls plotly to generate the final graph.
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
  Plotly.plot(outputDiv, [{
    x: xData,
    y: yData,
    type: plotType }],
    layout,
    {displayModeBar: false});
}

// function that interacts with the DOM for reading in PlotLite code and drawing the resulting plotly graph. Also handles outputing error messages.
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

