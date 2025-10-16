# Snake and Ladder Game

A classic Snake and Ladder game playable in the browser.

## Features
- 2 - 4 players (local turn-based)
- Interactive, visual 10x10 board
- Snakes and ladders with distinctive colors and arrowheads
- Dice rolling, turn tracking, and player tokens with color per player
- Clear win notification
- Responsive, modern UI
- Fully client-side, suitable for deployment on GitHub Pages

## Getting Started

### Play the Game
Just open `index.html` in any modern web browser.

### Local Setup
1. Clone this repository
2. Open `index.html` in your browser

_No build tools or servers are required._

## How to Play
1. Choose the number of players (2-4) and click **Start Game**.
2. Take turns clicking **Roll Dice**. Each player moves their token forward by the dice value.
3. Landing on the bottom of a ladder moves you up to its top; landing at a snake's head slides you to its tail.
4. First player to reach exactly square 100 wins!

- If a dice roll would move you past 100, you stay in place.
- Rolling a 6 gives another turn.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
