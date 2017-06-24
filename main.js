// Interact with the DOM for reading in PlotLite code and drawing the resulting plotly graph. Also handles outputing error messages.
/*
  global PlotliteParser
  global Plotlite
*/
function plotliteToPlotly() {
  let input = document.getElementById('plotliteCode').value;
  let outputDiv = document.getElementById('plotly');
  let messageDiv = document.getElementById('message');
  console.log('outputDiv is:', outputDiv);
  let message = 'Successful plot!';

  if (!input) {
    message = 'Please input PlotLite code.';
    outputDiv.value = '';
  }
  else {
    let plotliteParser = new PlotliteParser(input, outputDiv);
    let {plotlite, errorMessage} = plotliteParser.parsePlotlite();

    if (errorMessage) {
      message = errorMessage;
      outputDiv.innerHTML = '';
    }
    else {
      plotlite.renderPlotlite();
    }
  }
  messageDiv.innerHTML = message;
}
