const Cell = function () {
  let value = '';
  const getValue = function () {
    return value;
  };
  const setValue = function (valueP) {
    if (value != 'X' || value != 'O') {
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
    console.log(board);
  };

  return { printBoard };
})();
