
/* This function parses PlotLite format strings and output plotly format strings.
PlotList format guide:
The first line should start with a chart type keyword, followed by the chart title.
The second line starts with the xData keyword, followed by data to be plotted on the x-axis.
The third line starts with the yData keyword, followed by data to be plotted on the y-axis.
For chart type, currently supporting scatter, bar plots.
*/

function parsePlotLine(plotLine){
  const plotLineEndOfType = plotLine.indexOf(' ');
  const plotType = plotLine.slice(0, plotLineEndOfType);
  const plotTitle = plotLine.slice(plotLineEndOfType + 1).trim();
  return {plotType:plotType, plotTitle:plotTitle};
}

function parseData(dataLine){
  const dim = dataLine.match(/[xyz](?!data)/i); //matches x,y,or z followed by 'data'
  const data = dataLine.match(/[-*.*0-9]+|\s(?!,)/g); //matches any signed or unsigned numbers and spaces followed by ',' globally
  return {dim:dim, data:data};    
}

function parsePlotlite(input, outputDiv) {
  try {
    if(!input) throw 'Please input PlotLite code.';
    const lines = input.split('\n');
    const numLines = lines.length; 
    if(numLines < 3) throw 'Insuffient inputs. Please refer to format guide for input formatting!';
    const plotLine = lines[0];
    const plotType, plotTitle;
    plotType, plotTitle = parsePlotLine(plotLine);
    if (plotType !== 'scatter' && plotType !== 'bar') throw 'Undefined chart type! Supported chart types: scatter, bar.';
    const dataLines = lines.slice(1);
    dataLines.forEach(	
  }
  catch(err) {
        outputDiv.innerHTML = err;
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
