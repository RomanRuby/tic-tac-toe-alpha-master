const init = {
  board:                [],
  BOARD_SIDE:           4,
  BOARD_SIZE:           16,
  WIN_COMBINATION:      3,
  UNOCCUPIED:           '',
  HUMAN_PLAYER_VIEW:    '<img src="images/o.png" >',
  COMPUTER_PLAYER_VIEW: '<img src="images/x.png" >',
  HUMAN_PLAYER:         'O',
  COMPUTER_PLAYER:      'X',
  active_turn:          "COMPUTER",
  choice:               '',
  searchTimes:          [],
  showAverageTime:      true,
  worker:               new Worker('js/worker.js')
};

newGame = () => {
  loadBorder();

  for (let i = 0; i < init.BOARD_SIZE; i++) {
    init.board[i] = init.UNOCCUPIED;
  }
  init.showAverageTime = true;
  init.active_turn     = "HUMAN";

  document.getElementById("turnInfo").innerHTML = "Your turn!";
};

function setStartConfiguration() {

  init.board           = [];
  init.BOARD_SIDE      = +document.getElementById('board_size').value;
  console.log(init.BOARD_SIDE);
  init.WIN_COMBINATION = +document.getElementById('winner_combination').value;
  init.BOARD_SIZE      = Math.pow(document.getElementById('board_size').value, 2);
  newGame();
}

function loadBorder() {
  let board   = ``;
  let counter = 0;

  for (let i = 0; i < init.BOARD_SIDE; i++) {
    for (let j = 0; j < init.BOARD_SIDE; j++) {
      board += '\r\n' + `<div class="block" onClick="makeMove(${counter++})"  ></div>`;
    }
  }
  document.getElementById('board').style.width = init.BOARD_SIDE * 34;
  document.getElementById('board').innerHTML   = board;
}

function makeMove(pos) {
  if (!gameOver(init.board) && init.board[pos] === init.UNOCCUPIED && init.active_turn === "HUMAN") {
    init.board[pos]                                         = init.HUMAN_PLAYER;
    document.getElementsByClassName('block')[pos].innerHTML = init.HUMAN_PLAYER_VIEW;
    if (!gameOver(init.board)) {
      init.active_turn                              = "COMPUTER";
      document.getElementById("turnInfo").innerHTML = "Computer's turn.";
      makeComputerMove();
    }
  }
}

function makeComputerMove() {
  let start, end, time;
  start = new Date().getTime() / 1000;
  init.worker.postMessage([JSON.stringify(init), 0, -Infinity, +Infinity]);
  init.worker.addEventListener('message', function (event) {
    if (event.data === init.choice) {
      return;
    }
    init.choice = event.data;
    end         = new Date().getTime() / 1000;
    time        = end - start;
    if (time < 1000) {
      window.setTimeout(makeComputerMoveAfterDelay, 1000 - time);
      return;
    }
    window.setTimeout(makeComputerMoveAfterDelay);
  });
}
function makeComputerMoveAfterDelay() {
  const move                                               = init.choice;
  init.board[move]                                         = init.COMPUTER_PLAYER;
  document.getElementsByClassName('block')[move].innerHTML = init.COMPUTER_PLAYER_VIEW;
  init.choice                                              = [];
  init.active_turn                                         = "HUMAN";
  if (!gameOver(init.board)) {
    const alert     = document.getElementById("turnInfo");
    alert.innerHTML = "Your turn!";
  }
}

function checkForWinner(game) {

  for (let i = 0; i < init.BOARD_SIDE * init.BOARD_SIDE; i = i + init.BOARD_SIDE) {
    let human = 0, computer = 0;
    for (let j = i; j < i + init.BOARD_SIDE; j++) {
      if (game[j] === init.HUMAN_PLAYER) {
        human++;
      }
      else {
        human = 0;
      }
      if (game[j] === init.COMPUTER_PLAYER) {
        computer++;
      }
      else {
        computer = 0;
      }
      if (computer === init.WIN_COMBINATION) {
        return 3;
      }
      if (human === init.WIN_COMBINATION) {
        return 2;
      }
    }
  }

  for (let i = 0; i < init.BOARD_SIDE; i++) {
    let human = 0, computer = 0;
    for (let j = i; j < init.BOARD_SIDE * init.BOARD_SIDE; j = j + init.BOARD_SIDE) {
      if (game[j] === init.HUMAN_PLAYER) {
        human++;
      }
      else {
        human = 0;
      }
      if (game[j] === init.COMPUTER_PLAYER) {
        computer++;
      }
      else {
        computer = 0;
      }
      if (computer === init.WIN_COMBINATION) {
        return 3;
      }
      if (human === init.WIN_COMBINATION) {
        return 2;
      }
    }
  }

  for (let i = init.BOARD_SIDE - 1; i >= 0; i--) {
    let human = 0, computer = 0;
    for (let j = i, counter = i; j < init.BOARD_SIDE * init.BOARD_SIDE; j = j + init.BOARD_SIDE, counter--) {
      for (let k = j; counter >= 0; k = k + init.BOARD_SIDE - 1, counter--) {
        if (game[k] === init.HUMAN_PLAYER) {
          human++;
        }
        else {
          human = 0;
        }
        if (game[k] === init.COMPUTER_PLAYER) {
          computer++;
        }
        else {
          computer = 0;
        }
        if (computer === init.WIN_COMBINATION) {
          return 3;
        }
        if (human === init.WIN_COMBINATION) {
          return 2;
        }
      }
    }
  }

  for (let i = 0; i < init.BOARD_SIDE; i++) {
    let human = 0, computer = 0;
    for (let j = i, counter = i; j < init.BOARD_SIDE * init.BOARD_SIDE; j = j + init.BOARD_SIDE, counter++) {
      for (let k = j; counter <= init.BOARD_SIDE; k = k + init.BOARD_SIDE + 1, counter++) {
        if (game[k] === init.HUMAN_PLAYER) {
          human++;
        }
        else {
          human = 0;
        }
        if (game[k] === init.COMPUTER_PLAYER) {
          computer++;
        }
        else {
          computer = 0;
        }
        if (computer === init.WIN_COMBINATION) {
          return 3;
        }
        if (human === init.WIN_COMBINATION) {
          return 2;
        }
      }
    }
  }

  for (let i = 0; i < init.BOARD_SIZE; i++) {
    if (game[i] !== init.HUMAN_PLAYER && game[i] !== init.COMPUTER_PLAYER)
      return 0;
  }

  return 1;

}

function gameOver(game) {
  if (checkForWinner(game) === 0) {
    return false;
  }
  else if (checkForWinner(game) === 1) {
    let alert       = document.getElementById("turnInfo");
    alert.innerHTML = "It is a tie.";
  }
  else if (checkForWinner(game) === 2) {
    let alert       = document.getElementById("turnInfo");
    alert.innerHTML = "You have won! Congratulations!";
  }
  else {
    let alert       = document.getElementById("turnInfo");
    alert.innerHTML = "The computer has won.";
  }
  return true;
}
