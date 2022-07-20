function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("json/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("json/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    console.log(result)
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").append("b").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("json/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var bactSample = data.samples

    console.log(bactSample)

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultBact = bactSample.filter(bactObj => bactObj.id == sample)


    // div 3 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gMetaData = data.metadata;
    var guageMeta = gMetaData.filter(bactObj => bactObj.id == sample)

    console.log(guageMeta)



    //  5. Create a variable that holds the first sample in the array.
    var resultB = resultBact[0];

    // div 3 2. Create a variable that holds the first sample in the metadata array.
    var resultG = guageMeta[0];

    console.log(resultG)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var otuId = resultB.otu_ids;
    var otuLabels = resultB.otu_labels;
    var sampleValues = resultB.sample_values;


    console.log(otuLabels)
    console.log(sampleValues)

    // div3 3. Create a variable that holds the washing frequency to floating point.

    var washFreq = parseFloat(resultG.wfreq)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuId.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse()

    console.log(yticks)

    // 8. Create the trace for the bar chart. 


    var barData = {

      x: sampleValues.slice(0, 10).reverse(),

      y: yticks,

      text: otuLabels.slice(0, 10).reverse(),

      type: "bar",

      orientation: "h",

      marker: {
        color: 'rgb(142,124,195)'
      }
          

    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {

      title: "<b>Top 10 Bacteria Cultures Found</b>",

      margins: "automargin",

      hovermode: "closest"

    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);


    // Bar and Bubble charts
    // Create the buildCharts function.
    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    //Plotly.newPlot();

    // 1. Create the trace for the bubble chart.
    var bubbleData = {

      x: otuId,

      y: sampleValues,

      text: otuLabels,

      mode: "markers",

      marker: {
        size: sampleValues,
        color: otuId,
        colorscale: "RdBu"
      }

    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {

      title: "<b>Bacteria Cultures Per Sample</b>",

      xaxis: { title: "OTU ID" },

      automargin: true,

      hovermode: "closest"

    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);


    // 4. Create the trace for the gauge chart.
    var gaugeData = {

      type: "indicator",

      value: washFreq,

      mode: "gauge+number",

      title: { text: "<b> Belly Button Washing Frequency </b> <br> Scrubs per Week </br>" } ,

      gauge: {
        axis: { range: [null, 10]},
        bar: { color: "lightslategrey" },
        steps: [
          { range: [0, 2], color: "rgb(142,124,195)" },
          { range: [2, 4], color: "mediumpurple"},
          { range: [4, 6], color: "mediumslateblue"},
          { range: [6, 8], color: "slateblue"},
          { range: [8, 10], color: "darkslateblue"},
        ],
        threshold: {value:washFreq}
       
      }



    };

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600,
      height: 500, 
      margin: {t:0, b:0}


    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
}

