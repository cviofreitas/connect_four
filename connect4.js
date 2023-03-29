/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const newGameBtn = document.querySelector(".startgame");
const WIDTH = 7;
const HEIGHT = 6;
let MousePosition = null;
let currPlayer = 1; // active player: 1 or 2
let board = [];
// array of rows, each row is array of cells  (board[y][x])
/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // make column tops (clickable area for adding a piece to that column)
  const board = document.getElementById("board");
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.classList.add('p1');
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  } board.append(top);

  // make main part of board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      cell.addEventListener("click", handleClick);
      cell.className = "mainboard";
      row.append(cell);
      //highlight top row(x) when mouse enters anywhere or (x)column
      cell.onmouseenter = () => {
        MousePosition = `${x}`;
        let hovered = document.getElementById(`${MousePosition}`);
        hovered.className = "hovered";
      };
      // unhighlight top row when mouse leaves (x)column
      cell.onmouseleave = () => {
        MousePosition = `${x}`;
        let hovered = document.getElementById(`${MousePosition}`);
        hovered.className = "not_hovered";
      };
    }
    board.append(row);
  }
}

// hoveredColumn(MousePosition)
/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  setTimeout(() => {
    spot.classList.add("placed");
  }, 400);
  spot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  const gamediv = document.getElementById("gameStarted");
  const playerWon = document.createElement("div");
  playerWon.innerText = msg;
  if (currPlayer === 1) {
    // class for red notification
    playerWon.className = 'winnerNotificaiton';
  }
  if (currPlayer === 2) {
    // class for blue notification
    playerWon.className = 'winnerNotificaiton2';
  }
  setTimeout(() => {
    //reload page
    location.reload();
  }, 4000);
  gamediv.append(playerWon);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let value = evt.target.id;
  const x = value.slice(-1);
  console.log(value);

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);


  // check for WIN
  if (checkForWin()) {
    // loop through all <td> and change class to game over which sets pointer-events to none
    let alltds = document.getElementsByTagName('td');
    for (var i = 0; i < alltds.length; i++) {
      alltds[i].classList.toggle('gameover');
    }
    // create message for winning player
    setTimeout(() => {
      currPlayer = currPlayer === 1 ? 2 : 1;
      return endGame(`Player ${currPlayer} won!`);
    }, 200);
  }

  // check for TIE
  if (board.every((row) => row.every((cell) => cell))) {
    // loop through all <td> and change class to game over which sets pointer-events to none
    let alltds = document.getElementsByTagName('td');
    for (var i = 0; i < alltds.length; i++) {
      alltds[i].classList.toggle('gameover');
    }
    // create message for tie game
    setTimeout(() => {
      return endGame("Tie!");
    }, 50);
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
  const showPlayer = document.querySelector(".currPlayer");
  const hovered = document.querySelector('#column-top')
  if (currPlayer === 1) {
    hovered.className = 'p1'
    showPlayer.innerText = "player one";
    showPlayer.id = "playerOne";
  } else {
    hovered.classList.toggle('p1')
    showPlayer.innerText = "player two";
    showPlayer.id = "playerTwo";
    console.log(currPlayer);
  }
}
//change the top right display to show current player status

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// 
newGameBtn.onclick = startGame;

function startGame() {
  const gameboard = document.querySelector("#game");
  gameboard.id = "gameStarted";
  newGameBtn.classList.toggle('hidden');
}

makeBoard();
makeHtmlBoard();
