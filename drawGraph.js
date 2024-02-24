
// Create a function to update the timestamp
function updateTimestamp(vPosixMs) {
  const newTimestamp = new Date(vPosixMs).toLocaleString();
  console.log(newTimestamp);
  timestampBox.textContent = newTimestamp;
}

let stopFlag = false;
let requestId;
let iterationBatchSize = 4; // Number of iterations to batch together

function drawGraph(iRentalID) {
  let vData;
  let gridImage; // Variable to store the cached grid lines image
  let offScreenCanvas;
  let offScreenContext;

  function storeData() {
    vData = ECGData(iRentalID);
    console.log("vData =", vData);

    let iData = [];
    for (let i = 0; i < vData.Count; i++) {
      iData.push(vData.Items[i].ECGValue);
    }

    // Set up the canvas
    const canvas = d3.select("#graphCanvas");
    const context = canvas.node().getContext("2d");
    const timestampBox = document.getElementById("timestampBox");
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!offScreenCanvas) {
      offScreenCanvas = document.createElement('canvas');
      offScreenCanvas.width = canvas.attr("width");
      offScreenCanvas.height = canvas.attr("height");
      offScreenContext = offScreenCanvas.getContext("2d");
      // Cache the grid lines on the off-screen canvas
      cacheGridLines();
    }
    let currentTimestamp = "";

    // Set up the initial data
    let data = [];
    const numDataPoints = 1600;
    const maxDataValue = Math.max(...iData);
    const minDataValue = Math.min(...iData);
    for (let i = 0; i < numDataPoints; i++) {
      data.push(null);
    }

    const min = (values) =>
      values.reduce((m, v) => (v != null && v < m ? v : m), Infinity);
    const max = (values) =>
      values.reduce((m, v) => (v != null && v > m ? v : m), -Infinity);

    // Set up the scales
    const xScale = d3.scaleLinear()
      .domain([0, numDataPoints - 1])
      .range([0, canvas.attr("width")]);

    // Function to cache the grid lines
    function cacheGridLines() {

      const numVerticalLines = 40;
      const numHorizontalLines = 8;
      const verticalSpacing = canvas.attr("width") / numVerticalLines;
      const horizontalSpacing = canvas.attr("height") / numHorizontalLines;
      const bigBox = "#dcdcdc";
      const smallBox = "#f5f5f5";
      offScreenContext.lineWidth = 1;

      // Draw the grid lines on the off-screen canvas
for (let i = 1; i < numVerticalLines; i++) {
  const x = i * verticalSpacing;
  offScreenContext.strokeStyle = bigBox;
  offScreenContext.beginPath();
  offScreenContext.moveTo(x, 0);
  offScreenContext.lineTo(x, offScreenCanvas.height);
  offScreenContext.stroke();
}

for (let i = 1; i < numHorizontalLines; i++) {
  const y = i * horizontalSpacing;
  offScreenContext.strokeStyle = bigBox;
  offScreenContext.beginPath();
  offScreenContext.moveTo(0, y);
  offScreenContext.lineTo(offScreenCanvas.width, y);
  offScreenContext.stroke();
}
      const numInnerLines = 4; // Number of lines to draw inside each grid
      const innerLineSpacingX = verticalSpacing / (numInnerLines + 1);
      const innerLineSpacingY = horizontalSpacing / (numInnerLines + 1);

      for (let i = 0; i < numVerticalLines; i++) {
        const x = i * verticalSpacing;
        for (let j = 0; j < numInnerLines; j++) {
          const innerX = x + (j + 1) * innerLineSpacingX;
          offScreenContext.strokeStyle = smallBox;
          offScreenContext.beginPath();
          offScreenContext.moveTo(innerX, 0);
          offScreenContext.lineTo(innerX, offScreenCanvas.height);
          offScreenContext.stroke();
        }
      }
      
      for (let i = 0; i < numHorizontalLines; i++) {
        const y = i * horizontalSpacing;
        for (let j = 0; j < numInnerLines; j++) {
          const innerY = y + (j + 1) * innerLineSpacingY;
          offScreenContext.strokeStyle = smallBox;
          offScreenContext.beginPath();
          offScreenContext.moveTo(0, innerY);
          offScreenContext.lineTo(offScreenCanvas.width, innerY);
          offScreenContext.stroke();
        }
      }
      return offScreenCanvas;
    }

    // Cache the grid lines if they haven't been cached yet
    if (!gridImage) {
      gridImage = cacheGridLines();
    }

    // Function to update the graph with new data
    const updateGraph = (i, iDataPoint) => {
      // Update the data
      data.push(iDataPoint);
      data.shift();

      const maxDataValueIn = max(data);
      const minDataValueIn = min(data);


      const yScale = d3.scaleLinear()
        .domain([minDataValueIn, maxDataValueIn])
        .range([canvas.attr("height"), 0]);

      // Clear the canvas
      context.clearRect(0, 0, canvas.attr("width"), canvas.attr("height"));

      // Draw the cached grid lines
      context.drawImage(offScreenCanvas, 0, 0);


      
      // Draw the line
      context.beginPath();
      context.moveTo(xScale(0), yScale(data[0]));
      for (let i = 1; i < numDataPoints; i++) {
        if (data[i] !== null) {
          context.lineTo(xScale(i), yScale(data[i]));
        }
      }
      context.lineWidth = 2;
      context.strokeStyle = "#ff0000";
      context.stroke();

      // Update the timestamp
      if (vData.Items[i]) {
        const vPosixMs = vData.Items[i].PosixMs;
        if (currentTimestamp !== vPosixMs) {
          currentTimestamp = vPosixMs;
          updateTimestamp(currentTimestamp);
        }
      }
    };

    const executeBatch = (start, end) => {
      if (stopFlag) return;
  
      for (let i = start; i < end; i++) {
        const iDataPoint = iData[i];
        updateGraph(i, iDataPoint);
      }
  
      const nextBatchStart = end;
      const nextBatchEnd = Math.min(end + iterationBatchSize, vData.Count);
  
      if (nextBatchStart < vData.Count) {
        if (nextBatchStart % 1 === 0) { // Adjust the downsampling rate as needed
          requestId = requestAnimationFrame(() => executeBatch(nextBatchStart, nextBatchEnd));
        } else {
          executeBatch(nextBatchStart, nextBatchEnd);
        }
      } else {
        // Perform subsequent API calls
        const nextSecondTimestamp =
          Math.ceil(Date.now() / 1000) * 1000 + 1000; // Next second timestamp
        const timeDifference = nextSecondTimestamp - Date.now(); // Time difference until next second
        setTimeout(() => {
          storeData(); // Call storeData again for subsequent API calls
        }, timeDifference); // Delay until next second for subsequent API calls
      }
    };

    // Function to execute each iteration of the loop with requestAnimationFrame
    const executeIteration = (i) => {
      if (stopFlag) return;
  
      const batchEnd = Math.min(i + iterationBatchSize, vData.Count);
      executeBatch(i, batchEnd);
    };
  
    // Stop the graph
    function stopGraph() {
      cancelAnimationFrame(requestId);
      stopFlag = true;
    }

    // Clear any existing requestAnimationFrame
    cancelAnimationFrame(requestId);

    // Start the loop
    let i = 0;
    requestId = requestAnimationFrame(() => {
      executeIteration(i);
    });

    // Return the stopGraph function so that it can be accessed externally if needed
    return stopGraph;
  }

  // Call the storeData function to get the data and draw the graph
  return storeData();
}
