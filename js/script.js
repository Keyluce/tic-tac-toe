const Cell = function () {
  let value = '';
  const getValue = function () {
    return value;
  };
  const setValue = function (valueP) {
    if (valueP != 'X' && valueP != 'O') {
      return;
    }
    value = valueP;
  };

  return { getValue, setValue };
};

const gameBoard = function () {
  const board = [[], [], []];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[i].push(Cell());
    }
  }

  const printBoard = function () {
    const boardToPrint = board.map((row) => row.map((col) => col.getValue()));
    console.log(boardToPrint);
  };

  const addMove = function (row, col, player) {
    if (board[row][col].getValue() == '') {
      board[row][col].setValue(player.symbol);
    }
  };

  const getBoard = () => board;
  return { printBoard, addMove, getBoard };
};

const gameController = function () {
  const players = [
    {
      name: 'Player1',
      symbol: 'X',
    },
    {
      name: 'Player2',
      symbol: 'O',
    },
  ];

  const board = gameBoard();
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  printNewRound();

  const checkWin = (placedRow, placedCol) => {
    let boardValues = board
      .getBoard()
      .map((row) => row.map((col) => col.getValue()));

    const initialValue = boardValues[placedRow][placedCol];

    // Check Col
    let counter = 0;
    for (let i = 0; i < 3; i++) {
      if (boardValues[i][placedCol] === initialValue) {
        counter++;
        if (counter === 3) {
          return true;
        }
      } else {
        break;
      }
    }

    // Check Row
    counter = 0;
    for (let i = 0; i < 3; i++) {
      if (boardValues[placedRow][i] === initialValue) {
        counter++;
        if (counter === 3) {
          return true;
        }
      } else {
        break;
      }
    }

    // Diagonal
    counter = 0;

    for (let i = 0; i < 3; i++) {
      if (boardValues[i][i] === initialValue) {
        counter++;
        if (counter === 3) {
          return true;
        }
      } else break;
    }
    counter = 0;
    for (let i = 0; i < 3; i++) {
      if (boardValues[2 - i][i] === initialValue) {
        counter++;
        if (counter === 3) {
          return true;
        }
      } else break;
    }

    return false;
  };

  const playRound = (row, col) => {
    board.addMove(row, col, activePlayer);

    if (checkWin(row, col)) {
      console.log(`${activePlayer.name} won the game. GG!`);
      board.printBoard();
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };

  return { playRound, getBoard: board.getBoard };
};

const displayController = (function () {
  const game = gameController();
  const boardDiv = document.querySelector('.board');
  const player1Name = document.querySelector('.left .player-name');
  const player2Name = document.querySelector('.right .player-name');
  const updateUI = function () {
    boardDiv.textContent = '';
    const board = game
      .getBoard()
      .map((row) => row.map((col) => col.getValue()));

    board.forEach((row, indexRow) =>
      row.forEach((col, indexCol) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = indexRow;
        cell.dataset.column = indexCol;
        cell.textContent = col;

        boardDiv.appendChild(cell);
      })
    );
  };

  updateUI();

  boardDiv.addEventListener('click', function (e) {
    if (e.target.classList.contains('cell')) {
      game.playRound(e.target.dataset.row, e.target.dataset.column);
      updateUI();
    }
  });
})();
