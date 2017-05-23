
/* This function parses PlotLite format strings and output plotly format strings.
PlotList format guide:
The first line should start with a chart type keyword, followed by the chart title.
The second line starts with the xData keyword, followed by data to be plotted on the x-axis.
The third line starts with the yData keyword, followed by data to be plotted on the y-axis.
For chart type, currently supporting scatter, bar plots.
*/


function prepopulateExample() {
  let examplePlotLite = `
  scatter My awesome scatter plot
  xData 1,2,3,4,5,6,7,8
  yData 2,4,6,8,10,12,14,16
`;
  let exampleContainer = document.getElementById('plotliteCode');
  exampleContainer.value = examplePlotLite;
}


function parsePlotLine(plotLine) {
  const plotLineEndOfType = plotLine.indexOf(' ');
  const plotType = plotLine.slice(0, plotLineEndOfType);
  const plotTitle = plotLine.slice(plotLineEndOfType + 1).trim();
  return {plotType: plotType, plotTitle: plotTitle};
}

function parseData(dataLine) {
  const dim = dataLine.match(/[xyz](?!Data)/); // matches x,y,or z followed by 'Data'
  const data = dataLine.match(/[-*.*0-9]+|\s(?!,)/g); // globally matches any signed or unsigned numbers and spaces followed by ',' 
  if (!dim) {
    return {dim: null, data: null};
  }
  if (!data) {
    return {dim: dim, data: null};
  }

  return {dim: dim, data: data};
}

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
  dataLines = dataLines.filter(entry => entry.trim() != ''); // throw away empty lines
  console.log(dataLines);
  for (let dataLine of dataLines) {
    let dim, data;
    ({dim, data} = parseData(dataLine));
    console.log(dim, data);
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

function generatePlotlyPlot(plotType, plotTitle, dataObject, outputDiv) {
  const xData = dataObject.xData;
  const yData = dataObject.yData;

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

function plotliteToPlotly() {
  let input = document.getElementById('plotliteCode').value;
  let outputDiv = document.getElementById('plotly');
  let {plotType, plotTitle, dataObject, errorMessage} = parsePlotlite(input);
  console.log(plotType, plotTitle, dataObject);

  if (errorMessage) {
    outputDiv.innerHTML = errorMessage;
  }
  else {
    //generatePlotlyPlot(plotType, plotTitle, dataObject, outputDiv);
    outputDiv.innerHTML = [plotType,plotTitle,errorMessage].join('-');
    console.log(dataObject);
  }
}



  /*
  if (!input) {
    var output = 'Please input PlotLite code.';
  }
  else {
    let lines = input.split('\n');
    if (lines.length < 3) {
      output = 'Insuffient inputs. Please refer to format guide for input formatting!';
    }
    else {
      const plotLine = lines[0].trim();
      const plotType, plotTitle = parsePlotLine(plotLine);

      if (plotType === 'scatter' || plotType === 'bar') {
        const xDataLine = lines[1];
        const yDataLine = lines[2];
        const xData = xDataLine.split(/,\s*|\s+/).filter(Number);
        const yData = yDataLine.split(/,\s*|\s+/).filter(Number);
        if ((xData.length === 0) || (yData.length === 0)) {
          output = 'Please input both x and y data.';
        }
        else {
          output =
          `
          var layout = {
            title: '${plotTitle}',
            autosize: true,
            width: 500,
            height: 300,
            margin: {
            t: 100, b: 0, l: 0, r: 0
            }
          };

          Plotly.plot(this.div, [{
            x: [${xData}],
            y: [${yData}],
            type: '${plotType}' }],
            layout,
            {displayModeBar: false});
          `;
        }
      }
      else {
	output = 'Undefined chart type! Please declare your chart type in the first line of your input. Supported chart types: scatter, bar #to add more later';
      }
    }
  }
  return output;
}

function plotliteTranslate() {
  const x = document.getElementById('plotliteCode').value;
  document.getElementById('plotly').innerHTML = plotliteToPlotly(x);
}
*/
