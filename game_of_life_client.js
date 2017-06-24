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
      const rectX = padding + x * (cellLength);
      const rectY = padding + y * (cellLength);

      context.fillStyle='rgb(100, 149, 237)';
      context.fillRect(rectX, rectY, cellLength, cellLength);
    });
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawLiveCells();
}

window.onload = () => {
  let currentBoard = [[5,5], [6,5], [7,5], [7,4], [6,3]];
  drawBoard(currentBoard);

  let count = 0;

  function requestNewBoard() {
    const req = new XMLHttpRequest();
    req.onload = handleNewBoard;
    req.open("POST", "http://localhost:3000/worlds/next", true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify({live_cells: currentBoard}));
  }

  function handleNewBoard() {
    currentBoard = JSON.parse(this.response).live_cells;

    drawBoard(currentBoard);
    setTimeout(requestNewBoard, 200);
  }

  setTimeout(requestNewBoard, 200);
};
