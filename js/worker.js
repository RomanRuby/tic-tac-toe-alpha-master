self.addEventListener('message', function (event) {
  this.inits = JSON.parse(event.data[0]);

  alphaBetaMinimax(this.inits.board, event.data[1], event.data[2], event.data[3]);
  self.postMessage(this.inits.choice);

  function gameScore(game, depth) {
    let score = checkForWinner(game);
    if (score === 1)
      return 0;
    else if (score === 2)
      return depth - 10;
    else if (score === 3)
      return 10 - depth;
  }

  function undoMove(game, move) {
    game[move] = this.inits.UNOCCUPIED;
    changeTurn();
    return game;
  }

  function getNewState(move, game) {
    game[move] = changeTurn();
    return game;
  }

  function changeTurn() {
    let piece;
    if (this.inits.active_turn === "COMPUTER") {
      piece             = 'X';
      this.inits.active_turn = "HUMAN";
    } else {
      piece             = 'O';
      this.inits.active_turn = "COMPUTER";
    }
    return piece;
  }

  function getAvailableMoves(game) {
    const possibleMoves = [];
    for (let i = 0; i < this.inits.BOARD_SIZE; i++) {
      if (game[i] === this.inits.UNOCCUPIED)
        possibleMoves.push(i);
    }
    return possibleMoves;
  }

  function alphaBetaMinimax(node, depth, alpha, beta) {
    if (checkForWinner(node) === 1 || checkForWinner(node) === 2
      || checkForWinner(node) === 3) {
      return gameScore(node, depth);
    }

    depth += 1;
    let availableMoves = getAvailableMoves(node);
    let move, result, possible_game;
    if (this.inits.active_turn === "COMPUTER") {
      for (let i = 0; i < availableMoves.length; i++) {
        move          = availableMoves[i];
        possible_game = getNewState(move, node);
        result        = alphaBetaMinimax(possible_game, depth, alpha, beta);
        node          = undoMove(node, move);
        if (result > alpha) {
          alpha = result;
          if (depth === 1) {
            this.inits.choice = move;
          }
        } else if (alpha >= beta || depth > 2) {
          return alpha;
        }
      }
      return alpha;
    } else {
      for (let i = 0; i < availableMoves.length; i++) {
        move          = availableMoves[i];
        possible_game = getNewState(move, node);
        result        = alphaBetaMinimax(possible_game, depth, alpha, beta);
        node          = undoMove(node, move);

        if (result < beta) {
          beta = result;
          if (depth === 1) {
            this.inits.choice = move;
          }
        } else if (beta <= alpha || depth > 2) {
          return beta;
        }
      }

      return beta;
    }
  }

  /**
   * Check for a winner.  Return
   0 if no winner or tie yet
   1 if it's a tie
   2 if HUMAN_PLAYER won
   3 if COMPUTER_PLAYER won
   */
  function checkForWinner(game) {
    /**
     * Check for horizontal wins
     */
    for (let i = 0; i < this.inits.BOARD_SIDE * this.inits.BOARD_SIDE; i = i + this.inits.BOARD_SIDE) {
      let human = 0, computer = 0;
      for (let j = i; j < i + this.inits.BOARD_SIDE; j++) {
        if (game[j] === this.inits.HUMAN_PLAYER) {
          human++;
        }
        else {
          human = 0;
        }
        if (game[j] === this.inits.COMPUTER_PLAYER) {
          computer++;
        }
        else {
          computer = 0;
        }
        if (computer === this.inits.WIN_COMBINATION) {
          return 3;
        }
        if (human === this.inits.WIN_COMBINATION) {
          return 2;
        }
      }
    }

    /**
     *  Check for vertical wins
     */
    for (let i = 0; i < this.inits.BOARD_SIDE; i++) {
      let human = 0, computer = 0;
      for (let j = i; j < this.inits.BOARD_SIDE * this.inits.BOARD_SIDE; j = j + this.inits.BOARD_SIDE) {
        if (game[j] === this.inits.HUMAN_PLAYER) {
          human++;
        }
        else {
          human = 0;
        }
        if (game[j] === this.inits.COMPUTER_PLAYER) {
          computer++;
        }
        else {
          computer = 0;
        }
        if (computer === this.inits.WIN_COMBINATION) {
          return 3;
        }
        if (human === this.inits.WIN_COMBINATION) {
          return 2;
        }
      }
    }

    /**
     * Check for diagonal top-right wins
     */
    for (let i = this.inits.BOARD_SIDE - 1; i >= 0; i--) {
      let human = 0, computer = 0;
      for (let j = i, counter = i; j < this.inits.BOARD_SIDE * this.inits.BOARD_SIDE; j = j + this.inits.BOARD_SIDE, counter--) {
        for (let k = j; counter >= 0; k = k + inits.BOARD_SIDE - 1, counter--) {
          if (game[k] === this.inits.HUMAN_PLAYER) {
            human++;
          }
          else {
            human = 0;
          }
          if (game[k] === this.inits.COMPUTER_PLAYER) {
            computer++;
          }
          else {
            computer = 0;
          }
          if (computer === this.inits.WIN_COMBINATION) {
            return 3;
          }
          if (human === this.inits.WIN_COMBINATION) {
            return 2;
          }
        }
      }
    }

    /**
     *  Check for diagonal down-left wins
     */
    for (let i = 0; i < this.inits.BOARD_SIDE; i++) {
      let human = 0, computer = 0;
      for (let j = i, counter = i; j < this.inits.BOARD_SIDE * this.inits.BOARD_SIDE; j = j + this.inits.BOARD_SIDE, counter++) {
        for (let k = j; counter <= this.inits.BOARD_SIDE; k = k + this.inits.BOARD_SIDE + 1, counter++) {
          if (game[k] === this.inits.HUMAN_PLAYER) {
            human++;
          }
          else {
            human = 0;
          }
          if (game[k] === this.inits.COMPUTER_PLAYER) {
            computer++;
          }
          else {
            computer = 0;
          }
          if (computer === this.inits.WIN_COMBINATION) {
            return 3;
          }
          if (human === this.inits.WIN_COMBINATION) {
            return 2;
          }
        }
      }
    }

    /**
     * Check for tie
     */
    for (let i = 0; i < this.inits.BOARD_SIZE; i++) {
      if (game[i] !== this.inits.HUMAN_PLAYER && game[i] !== this.inits.COMPUTER_PLAYER)
        return 0;
    }
    return 1;
  }

});