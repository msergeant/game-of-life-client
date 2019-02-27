async function runTests() {
  let apiURL = document.getElementById("urlBox").value;
  let innerHTML = '';

  let testsToRun = [
    testURLExists,
    testEmptyList,
    testKnownBoard,
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
        if (!this.response || this.response.length == 0) {
          resolve(testResult(false, "The API response was empty"));
        } else if (this.status >= 200 && this.status < 300) {
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

  function testKnownBoard() {
      let initial_cells = [
        [7,0], [7,1], [7,2], [7,3], [7,4], [7,5], [7,6], [7,7], [7,8], [7,9]
      ];
      let expected_cells = [
          [6, 1], [6,2], [6,3], [6,4], [6,5], [6,6], [6,7], [6,8],
          [7, 1], [7,2], [7,3], [7,4], [7,5], [7,6], [7,7], [7,8],
          [8, 1], [8,2], [8,3], [8,4], [8,5], [8,6], [8,7], [8,8]
      ];

    const req = new XMLHttpRequest();
    req.open("POST", apiURL, true);
    req.setRequestHeader("Content-type", "application/json");

    return new Promise((resolve) => {
      req.onload = function () {
        if (!this.response || this.response.length == 0) {
          resolve(testResult(false, "The API response was empty"));
        } else if (this.status >= 200 && this.status < 300) {
          let cells = JSON.parse(this.response).live_cells;
          if(cells == undefined || !Array.isArray(cells) || cells.length == 0) {
            resolve(testResult(false, "The response is incorrect for a known list."));
          } else {
            let valid = true;
            let missingCells = [];

            for(let i = 0; i < expected_cells.length; i++) {
              let cell = expected_cells[i];
              if( !cells.find((x) => x[0] == cell[0] && x[1] == cell[1] )) {
                missingCells.push(JSON.stringify(cell));
                valid = false;
              }
            }

            if(valid) {
              resolve(testResult(true, "The response is correct for a known list"));
            } else {
              resolve(testResult(false, "The known list response is missing " + missingCells.join(", ")));
            }
          }
        } else {
          resolve(testResult(false, "The URL is responding with an error"));
        }
      };

      req.send(JSON.stringify({live_cells: initial_cells}))
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
