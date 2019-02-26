# game_of_life_client

This is a generic game of life viewer. The idea is that I will build
server side implementations of the game of life and call them through an
API. This will then display the results.

Here are the implementation APIs that I have done so far:

[Rails API](https://github.com/msergeant/game-of-life-rails)

[Phoenix API](https://github.com/msergeant/game-of-life-phoenix)

[Golang API](https://github.com/msergeant/game-of-life-go)

[Node API](https://github.com/msergeant/game-of-life-node)


## How to use this client

1. Open `index.html` in a browser.
2. Change the URL to the server running your API.
3. Click 'Start' to start a loop that will repeatedly request new
   iterations of game of life board.
