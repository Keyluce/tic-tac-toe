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

const gameBoard = (function () {
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
})();

const gameController = (function (player1Name, player2Name) {
  const players = [
    {
      name: player1Name,
      symbol: 'X',
    },
    {
      name: player2Name,
      symbol: 'O',
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    gameBoard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  printNewRound();

  const checkWin = (placedRow, placedCol) => {
    let board = gameBoard
      .getBoard()
      .map((row) => row.map((col) => col.getValue()));

    const initialValue = board[placedRow][placedCol];

    // Check Col
    let counter = 0;
    for (let i = 0; i < 3; i++) {
      if (board[i][placedCol] === initialValue) {
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
      if (board[placedRow][i] === initialValue) {
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
      if (board[i][i] === initialValue) {
        counter++;
        if (counter === 3) {
          return true;
        }
      } else break;
    }
    counter = 0;
    for (let i = 0; i < 3; i++) {
      if (board[2 - i][i] === initialValue) {
        counter++;
        if (counter === 3) {
          return true;
        }
      } else break;
    }

    return false;
  };

  const playRound = (row, col) => {
    gameBoard.addMove(row, col, activePlayer);

    if (checkWin(row, col)) {
      console.log(`${activePlayer} won the game. GG!`);
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };

  return { playRound };
})('Adam Race', 'John Doe');
