function drawBoard(liveCells = []){
  const boxWidth = 600;
  const boxHeight = 600;
  const cellLength = 12;
  const padding = 10;

  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  function drawGrid() {
    for (let x = 0; x <= boxWidth; x += cellLength) {
      context.moveTo(0.5 + x + padding, padding);
      context.lineTo(0.5 + x + padding, boxHeight + padding);
    }

    for (let x = 0; x <= boxHeight; x += cellLength) {
      context.moveTo(padding, 0.5 + x + padding);
      context.lineTo(boxWidth + padding, 0.5 + x + padding);
    }

    context.strokeStyle = "black";
    context.stroke();
  }

  function drawLiveCells() {
    liveCells.forEach( ([x, y]) => {
      if(x >= 0 && x <= 49 && y >= 0 && y <= 49) {
        const rectX = padding + x * (cellLength);
        const rectY = padding + y * (cellLength);

        context.fillStyle='rgb(100, 149, 237)';
        context.fillRect(rectX, rectY, cellLength, cellLength);
      }
    });
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawLiveCells();
}

window.onload = () => {
  let running = false;
  let currentBoard = getBoard('randy');
  let requestStart = 0;
  let totalRequests = 0;
  let totalTime = 0;
  drawBoard(currentBoard);

  const startButton = document.getElementById("start");
  startButton.onclick = startStopClick;

  const nextButton = document.getElementById("next");
  nextButton.onclick = nextClick;

  const startPatterDropdown = document.getElementById("startPattern");
  startPatterDropdown.onchange = startPatternChange;

  const responseTimeElement = document.getElementById("responseTime");
  const averageResponseTimeElement = document.getElementById("averageResponseTime");

  function startStopClick() {
    running = !running;

    if(running) {
      totalRequests = 0;
      totalTime = 0;
      responseTimeElement.textContent = "";
      averageResponseTimeElement.textContent = "";
      startButton.textContent = "Stop";
      requestNewBoard();
    } else {
      startButton.textContent = "Start";
    }
  }

  function startPatternChange() {
    if(!running) {
      currentBoard = getBoard(document.getElementById("startPattern").value);
      drawBoard(currentBoard);
    }
  }

  function getBoard(boardName) {
    const randy = [];
    [...Array(50)].forEach((_,i) => {
      [...Array(50)].forEach((_,j) => {
        if(Math.random() >= 0.8) {
          randy.push([i,j]);
        }
      })
    });
    const boards = {
      exploder: [[21,23], [21,24], [21,25], [21,26], [21,27], [25,23], [25,24], [25,25], [25,26], [25,27], [23,23], [23, 27]],
      glider: [[5,5], [6,5], [7,5], [7,4], [6,3]],
      randy: randy
    }
    return boards[boardName];
  }

  function nextClick() {
    requestNewBoard();
  }

  function requestNewBoard() {
    const req = new XMLHttpRequest();
    const url = document.getElementById("urlBox").value;
    req.onload = handleNewBoard;
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify({live_cells: currentBoard}));
    requestStart = performance.now();
    totalRequests += 1;
  }

  function handleNewBoard() {
    currentBoard = JSON.parse(this.response).live_cells;
    let elapsedTime = performance.now() - requestStart;
    totalTime += elapsedTime;
    responseTimeElement.textContent = elapsedTime.toFixed(2) + " ms";
    averageResponseTimeElement.textContent = (totalTime / totalRequests).toFixed(2)+ " ms";

    drawBoard(currentBoard);
    if(running) {
      setTimeout(requestNewBoard, 0);
    }
  }

};
