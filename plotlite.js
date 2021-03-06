
/*
PlotLite is a declarative ploting language that aims to simplify the making of interactive plots. This script translates PlotLite code to plotly.js.
PlotLite format guide:
The first line should start with a chart type keyword, followed by the chart title.
The second line starts with the xData keyword, followed by data to be plotted on the x-axis.
The third line starts with the yData keyword, followed by data to be plotted on the y-axis.
For chart type, currently supporting scatter, bar plots.
*/

class Plotlite {
  constructor(plotType, plotTitle, dataObject, outputDiv) {
    this.plotType = plotType;
    this.plotTitle = plotTitle;
    this.dataObject = dataObject;
    this.outputDiv = outputDiv;
  }
}

class Renderer {
  constructor 
  // potentially constructor can take a style object

  // this function can return a function that can be call after the Renderer object is long gone.
  renderDefer

  
  renderPlotlite(Plotlite, outputDiv) {
    const xData = this.dataObject.x;
    const yData = this.dataObject.y;

    let layout = {
      title: this.plotTitle,
      // autosize: true,
      width: 500,
      height: 300,
      margin: {
        t: 100, b: 0, l: 0, r: 0
      }
    };

    let data = [{
      x: xData,
      y: yData,
      type: this.plotType }];
    /* global Plotly */
    Plotly.newPlot(
      this.outputDiv,
      data,
      layout);
  }
}


class PlotliteParser {
  constructor(input, outputDiv) {
    this.input = input;
    this.outputDiv = outputDiv;
  }

  parsePlotlite() {
    let plotType = null;
    let plotTitle = '';
    let dataObject = {};
    let errorMessage = '';
    let lines = this.input.split('\n');
    let numLines = lines.length;

    if (numLines > 0 && numLines < 3) {
      errorMessage = 'Insuffient inputs. Please refer to format guide for input formatting!';
    }
    else if (numLines >= 3) {
      const plotLine = lines[0];
      ({plotType, plotTitle} = this.parsePlotLine(plotLine));

      if (plotType === 'scatter' || plotType === 'bar') {
        let dataLines = lines.slice(1); // an Array of lines(strings) containing data
        dataLines = dataLines.filter(line => line.trim() !== ''); // throw away empty lines
        for (let dataLine of dataLines) {
          if (dataLine.startsWith('xData')) {
            dataObject.x = this.parseData(dataLine);
          }
          else if (dataLine.startsWith('yData')) {
            dataObject.y = this.parseData(dataLine);
          }
        }
        if (!dataObject.x || !dataObject.y) {
          errorMessage = 'Please provide xData and yData for plotting.';
        }
      }
      else if (plotType !== 'scatter' && plotType !== 'bar') {
        errorMessage = 'Undefined chart type! Supported chart types: scatter, bar.';
      }
    }
    // console.log(plotType, plotTitle, errorMessage);
    // console.log(new Plotlite(plotType, plotTitle, dataObject, this.outputDiv));
    return {
      plotlite: new Plotlite(plotType, plotTitle, dataObject, this.outputDiv),
      errorMessage: errorMessage
    };
  }

    // Parse plot type and plot title line.
  parsePlotLine(plotLine) {
    let plotLineEndOfType = plotLine.trim().indexOf(' ');
    let plotType = null;
    let plotTitle = '';

    if (plotLineEndOfType === -1) {
      plotType = plotLine;
    }
    else {
      plotType = plotLine.slice(0, plotLineEndOfType);
      plotTitle = plotLine.slice(plotLineEndOfType + 1).trim();
    }
    return {
      plotType: plotType,
      plotTitle: plotTitle
    };
  }

  // Parse Data line to obtain data from a specified dimension.
  parseData(dataLine) {
    var data = dataLine.match(/[-*.*0-9]+|\s(?=,)/g); // globally matches any signed or unsigned numbers and spaces followed by ','
    return data;
  }
}
