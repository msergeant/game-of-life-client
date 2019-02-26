async function runTests() {
  let apiURL = document.getElementById("urlBox").value;
  let innerHTML = '';

  let testsToRun = [
    testURLExists,
    testEmptyList,
  ];

  function testResult(success, message, stopAllTests = false) {
    return {success, message, stopAllTests};
  }

  function testURLExists() {
    const req = new XMLHttpRequest();
    req.open("POST", apiURL, true);
    req.setRequestHeader("Content-type", "application/json");

    return new Promise((resolve) => {
      req.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(testResult(true, "The URL is responding", false));
        } else {
          resolve(testResult(false, "The URL is responding with an error. " + apiURL + " should respond to a POST request.", true));
        }
      };

      req.onerror = function () {
        resolve(testResult(false, "The URL is not responding. " + apiURL + " should respond to a POST request.", true));
      };

      req.send(JSON.stringify({live_cells: []}))
    });
  };

  function testEmptyList() {
    const req = new XMLHttpRequest();
    req.open("POST", apiURL, true);
    req.setRequestHeader("Content-type", "application/json");

    return new Promise((resolve) => {
      req.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          let cells = JSON.parse(this.response).live_cells;
          if(cells == undefined || !Array.isArray(cells) || cells.length != 0) {
            resolve(testResult(false, "The response is incorrect for an empty list. Response should be {live_cells: []}"));
          } else {
            resolve(testResult(true, "The response is correct for an empty list"));
          }
        } else {
          resolve(testResult(false, "The URL is responding with an error"));
        }
      };

      req.send(JSON.stringify({live_cells: []}))
    });
  }

  for (let test of testsToRun) {
    let result = await test();
    let color = 'red';

    if(result.success) {
      color = 'green'
    }
    innerHTML += '<li style="color: ' + color + '">' + result.message + '</li>';

    if(!result.success && result.stopAllTests) {
      innerHTML += '<li style="color: red">Stopping all tests</li>';
      break;
    }
  }

  return new Promise((resolve, reject) => {
    resolve(innerHTML);
  });
}

window.onload = () => {
  const startButton = document.getElementById("start");
  startButton.onclick = startStopClick;

  const resultsArea = document.getElementById("results");

  function startStopClick() {
    resultsArea.innerHTML = '';
    runTests().then(data => {
      resultsArea.innerHTML = data;
    });
  }

  function requestNewBoard() {
    const req = new XMLHttpRequest();
    req.onload = handleNewBoard;
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify({live_cells: currentBoard}));
  }

};
