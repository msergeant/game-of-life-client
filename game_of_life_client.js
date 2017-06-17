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
  drawBoard([
    [0,0],
  ]);

  let count = 0;

  function updateBoard() {
    count += 1;
    drawBoard([
      [0, count],
    ]);

    if(count >= 49) {
      count = -1;
    }

    setTimeout(updateBoard, 200);
  }

  setTimeout(updateBoard, 200);
};
