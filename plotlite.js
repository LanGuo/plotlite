
/* This function parses PlotLite format strings and output plotly format strings.
PlotList format guide:
The first line should start with a chart type keyword, followed by the chart title.
The second line starts with the xData keyword, followed by data to be plotted on the x-axis.
The third line starts with the yData keyword, followed by data to be plotted on the y-axis.
For chart type, currently supporting scatter, bar plots.
*/
function plotliteToPlotly(input) {

  if (!input) {
    var output = "Please input PlotLite code.";
  }
  else {
    let lines = input.split('\n');
    if (lines.length < 3) {
      output = "Insuffient inputs. Please refer to format guide for input formatting!";
    }
    else {
      const plotLine = lines[0].trim();
      const plotLineEndOfType = plotLine.indexOf(' ');
      const plotType = plotLine.slice(0, plotLineEndOfType);
      const plotTitle = plotLine.slice(plotLineEndOfType + 1).trim();
      
      if (plotType === "scatter" || plotType === "bar") {
        var xDataLine = lines[1];
        var yDataLine = lines[2];
        var xData = xDataLine.split(/,\s*|\s+/).filter(Number);
        var yData = yDataLine.split(/,\s*|\s+/).filter(Number);
        if ((xData.length === 0) || (yData.length === 0)) {
          output = "Please input both x and y data.";
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
	output = "Undefined chart type! Please declare your chart type in the first line of your input. Supported chart types: scatter, bar #to add more later";
      }
    }
  }
  return output;
}


function plotliteTranslate() {
  const x = document.getElementById("plotliteCode").value;
  document.getElementById("plotly").innerHTML = plotliteToPlotly(x);
}
