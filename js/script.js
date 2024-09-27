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
  board = [[], [], []];
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
    } else {
      return false;
    }
  };

  const getBoard = () => board;

  return { printBoard, addMove, getBoard };
};

const gameController = function () {
  let moveCounter = 0;
  let hasWon = false;
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
  const checkDraw = () => {
    if (moveCounter >= 9) {
      return true;
    }
  };
  const playRound = (row, col) => {
    if (hasWon) {
      return;
    }

    if (board.addMove(row, col, activePlayer) === false) return;
    moveCounter++;

    if (checkWin(row, col)) {
      console.log(`${activePlayer.name} won the game. GG!`);
      board.printBoard();
      hasWon = true;
      return activePlayer.symbol;
    }
    if (checkDraw()) {
      return 'draw';
    }
    switchPlayerTurn();
    printNewRound();
  };

  return { playRound, getBoard: board.getBoard, getActivePlayer };
};

const displayController = (function () {
  let game = null;
  const boardDiv = document.querySelector('.board');
  const startButton = document.querySelector('.start-button');
  const player1Side = document.querySelector('.left');
  const player2Side = document.querySelector('.right');
  const player1Name = document.querySelector('.left .player-name');
  const player1Status = document.querySelector('.left .turn-message');
  const player2Status = document.querySelector('.right .turn-message');
  const player2Name = document.querySelector('.right .player-name');
  const player1Input = document.querySelector('#player1-name');
  const player2Input = document.querySelector('#player2-name');
  const updateUI = function () {
    if (!game) return;

    boardDiv.textContent = '';
    console.log(game.getActivePlayer().symbol);
    // game.getActivePlayer().symbol === 'X'
    //   ? player1Status.classList.toggle('active')
    //   : player2Status.classList.toggle('active');
    if (game.getActivePlayer().symbol === 'X') {
      player1Status.classList.add('active');
      player2Status.classList.remove('active');
      player1Status.textContent = 'Your Turn';
      player2Status.textContent = 'Please Wait';
    } else {
      player2Status.classList.add('active');
      player1Status.classList.remove('active');
      player1Status.textContent = 'Please Wait';
      player2Status.textContent = 'Your Turn';
    }
    boardRefresh();
  };

  updateUI();
  const boardRefresh = () => {
    boardDiv.textContent = '';

    const board = game
      .getBoard()
      .map((row) => row.map((col) => col.getValue()));

    board.forEach((row, indexRow) =>
      row.forEach((col, indexCol) => {
        const cell = document.createElement('button');
        cell.classList.add('cell');
        cell.dataset.row = indexRow;
        cell.dataset.column = indexCol;
        cell.textContent = col;
        col === 'X'
          ? (cell.style.color = 'rgb(255, 183, 49')
          : (cell.style.color = 'rgb(68, 208, 255)');

        boardDiv.appendChild(cell);
      })
    );
  };
  const init = function () {
    game = gameController();
    player1Name.textContent =
      player1Input.value.trim() === '' ? 'Player 1' : player1Input.value;
    player2Name.textContent =
      player2Input.value.trim() === '' ? 'Player 2' : player2Input.value;
    player1Input.style.display = 'none';
    player2Input.style.display = 'none';
    startButton.textContent = 'Restart';
    player1Status.textContent = 'Your Turn!';
    player1Status.classList.add('active');
    player2Status.textContent = 'Please Wait';
    player2Status.classList.remove('active');

    boardRefresh();
  };
  startButton.addEventListener('click', init);

  boardDiv.addEventListener('click', function (e) {
    if (e.target.classList.contains('cell') && game) {
      const result = game.playRound(
        e.target.dataset.row,
        e.target.dataset.column
      );
      updateUI();
      console.log(result);
      if (result === 'X') {
        player1Status.textContent = 'You Won!';
        player2Status.textContent = 'You Lost';
        game = null;
      } else if (result === 'O') {
        player2Status.textContent = 'You Won!';
        player1Status.textContent = 'You Lost';
        game = null;
      } else if (result === 'draw') {
        player1Status.textContent = "It's a tie!";
        player2Status.textContent = "It's a tie!";
        game = null;
      }
    }
  });

  boardDiv.addEventListener(
    'mouseenter',
    function (e) {
      if (game) {
        if (e.target.classList.contains('cell')) {
          game.getActivePlayer().symbol === 'X'
            ? (e.target.style.backgroundColor = 'rgba(255, 183, 49,0.1')
            : (e.target.style.backgroundColor = 'rgba(68, 208, 255,0.1)');
        }
      }
    },
    true
  );
  boardDiv.addEventListener(
    'mouseleave',
    function (e) {
      if (game) {
        if (e.target.classList.contains('cell')) {
          e.target.style.backgroundColor = '';
        }
      }
    },
    true
  );
})();
