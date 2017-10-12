let playerImage = new Image();
playerImage.src = "images/o.png";
let computerImage = new Image();
computerImage.src = "images/x.png";
let board = new Array();
let HALF_BOARD_SIZE = 3;
let BOARD_SIZE =9;
let WIN_COMBINATION = 3;
let UNOCCUPIED = ' ';
let HUMAN_PLAYER = 'O';
let COMPUTER_PLAYER = 'X';
let active_turn = "HUMAN";
let choice;
let searchTimes = new Array();
let showAverageTime = true;


function NewGame() {
    LoadBorder();
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = UNOCCUPIED;
        document.images[i].src = "images/blank.png";
    }
    DeleteTimes();
    showAverageTime = true;
    let alert = document.getElementById("turnInfo");
    active_turn = "HUMAN";
    alert.innerHTML = "Your turn!";

}
function SetStartParamets(HALF_BOARD_SIZE_NEW, WIN_COMBINATION_NEW) {
    board=[];
    HALF_BOARD_SIZE = HALF_BOARD_SIZE_NEW;
    WIN_COMBINATION = WIN_COMBINATION_NEW;
    BOARD_SIZE = HALF_BOARD_SIZE_NEW * HALF_BOARD_SIZE_NEW;

    LoadBorder();
    NewGame();
}
function LoadBorder() {
    let board = ``;

    for (let i = 0, counter = 0; i < HALF_BOARD_SIZE; i++) {
        for (let j = 0; j < HALF_BOARD_SIZE; j++) {
            //language=HTML
            board += '\r\n' + `<img src="images/blank.png"  border="2" width="75" height="71" onclick="MakeMove(${counter++})"style="position:absolute; left:${10 + j * 100}; top:${50 + i * 100}; z-index:1" />`;
        }
    }
    document.getElementById('board').innerHTML = board;
}
function MakeMove(pos) {
    if (!GameOver(board) && board[pos] === UNOCCUPIED) {
        board[pos] = HUMAN_PLAYER;
        document.images[pos].src = playerImage.src;
        if (!GameOver(board)) {
            let alert = document.getElementById("turnInfo");
            active_turn = "COMPUTER";
            alert.innerHTML = "Computer's turn.";
            MakeComputerMove();
        }
    }
}

function MakeComputerMove() {
    let start, end, time;
    start = new Date().getTime() / 1000;
    alphaBetaMinimax(board, 0, -Infinity, +Infinity);
    end = new Date().getTime() / 1000;
    time = end - start;
    ShowTimes(time);
    let move = choice;
    board[move] = COMPUTER_PLAYER;
    document.images[move].src = computerImage.src;
    choice = [];
    active_turn = "HUMAN";
    if (!GameOver(board)) {
        let alert = document.getElementById("turnInfo");
        alert.innerHTML = "Your turn!";
    }
}

/**
 * @return {number}
 */
function GameScore(game, depth) {
    let score = CheckForWinner(game);
    if (score === 1)
        return 0;
    else if (score === 2)
        return depth - 10;
    else if (score === 3)
        return 10 - depth;
}

function alphaBetaMinimax(node, depth, alpha, beta) {
    if (CheckForWinner(node) === 1 || CheckForWinner(node) === 2
        || CheckForWinner(node) === 3)
        return GameScore(node, depth);

    depth += 1;
    let availableMoves = GetAvailableMoves(node);
    let move, result, possible_game;
    if (active_turn === "COMPUTER") {
        for (let i = 0; i < availableMoves.length; i++) {
            move = availableMoves[i];
            possible_game = GetNewState(move, node);
            result = alphaBetaMinimax(possible_game, depth, alpha, beta);
            node = UndoMove(node, move);
            if (result > alpha) {
                alpha = result;
                if (depth === 1)
                    choice = move;
            } else if (alpha >= beta) {
                return alpha;
            }
        }
        return alpha;
    } else {
        for (let i = 0; i < availableMoves.length; i++) {
            move = availableMoves[i];
            possible_game = GetNewState(move, node);
            result = alphaBetaMinimax(possible_game, depth, alpha, beta);
            node = UndoMove(node, move);
            if (result < beta) {
                beta = result;
                if (depth === 1)
                    choice = move;
            } else if (beta <= alpha) {
                return beta;
            }
        }
        return beta;
    }
}

function UndoMove(game, move) {
    game[move] = UNOCCUPIED;
    ChangeTurn();
    return game;
}

function GetNewState(move, game) {
    let piece = ChangeTurn();
    game[move] = piece;
    return game;
}

function ChangeTurn() {
    let piece;
    if (active_turn === "COMPUTER") {
        piece = 'X';
        active_turn = "HUMAN";
    } else {
        piece = 'O';
        active_turn = "COMPUTER";
    }
    return piece;
}

function GetAvailableMoves(game) {
    let possibleMoves = new Array();
    for (let i = 0; i < BOARD_SIZE; i++) {
        if (game[i] === UNOCCUPIED)
            possibleMoves.push(i);
    }
    return possibleMoves;
}

// Check for a winner.  Return
//   0 if no winner or tie yet
//   1 if it's a tie
//   2 if HUMAN_PLAYER won
//   3 if COMPUTER_PLAYER won
/**
 * @return {number}
 */
function CheckForWinner(game) {
    // Check for horizontal wins
   // console.log(game);
    for (let i = 0; i < HALF_BOARD_SIZE * HALF_BOARD_SIZE; i = i + HALF_BOARD_SIZE) {
        let human = 0;
        for (let j = i; j <= i + HALF_BOARD_SIZE - 1; j++) {
            if (game[j] === HUMAN_PLAYER) {
                human++;
                //console.log("j",j);
            }
            else {
                human = 0;
            }
         //   console.log("aas",human);
            if (human === WIN_COMBINATION){
            return 2;
            }
        }
    }
    for (let i = 0; i < HALF_BOARD_SIZE * HALF_BOARD_SIZE; i = i + HALF_BOARD_SIZE) {
        let  computer = 0;
        for (let j = i; j <= i + HALF_BOARD_SIZE - 1; j++) {
            if (game[j] === COMPUTER_PLAYER) {
                computer++;
            }
            else {
                computer = 0;
            }
            if (computer === WIN_COMBINATION) {
                return 3;
            }
        }
    }
    // Check for vertical wins
    for (let i = 0; i < HALF_BOARD_SIZE; i++) {
        let human = 0;
        for (let j = i; j < HALF_BOARD_SIZE * HALF_BOARD_SIZE; j = j + HALF_BOARD_SIZE) {
            if (game[j] === HUMAN_PLAYER) {
                human++;
            }
            else {
                human = 0;
            }
            if (human === WIN_COMBINATION) {
                return 2;
            }
        }
    }

    for (let i = 0; i < HALF_BOARD_SIZE; i++) {
        let  computer = 0;
        for (let j = i; j < HALF_BOARD_SIZE * HALF_BOARD_SIZE; j = j + HALF_BOARD_SIZE) {
            if (game[j] === COMPUTER_PLAYER) {
                computer++;
            }
            else {
                computer = 0;
            }
            if (computer === WIN_COMBINATION) {
                return 3;
            }
        }
    }
    // Check for diagonal wins
    // for (let i = 0; i < HALF_BOARD_SIZE - 1; i++) {
    //     let human = 0, computer = 0;
    //     for (let j = i; i < HALF_BOARD_SIZE * HALF_BOARD_SIZE; j = j + HALF_BOARD_SIZE) {
    //         for (let k = j, counter = 0; i < HALF_BOARD_SIZE * HALF_BOARD_SIZE, counter < HALF_BOARD_SIZE - i; k = k + HALF_BOARD_SIZE + 1, counter++) {
    //             if (game[k] === HUMAN_PLAYER) {
    //                 human++;
    //             }
    //             else {
    //                 human = 0;
    //             }
    //             if (game[k] === COMPUTER_PLAYER) {
    //                 computer++;
    //             }
    //             else {
    //                 computer = 0;
    //             }
    //             if (computer === WIN_COMBINATION) {
    //                 return 3;
    //             }
    //             if (human === WIN_COMBINATION) {
    //                 return 2;
    //             }
    //         }
    //     }
    // }
    // for (let i = 0; i < HALF_BOARD_SIZE - 1; i++) {
    //     let human = 0, computer = 0;
    //     for (let j = i; i < HALF_BOARD_SIZE * HALF_BOARD_SIZE; j = j + HALF_BOARD_SIZE) {
    //         for (let k = j, counter = i; i < HALF_BOARD_SIZE * HALF_BOARD_SIZE, counter > 0; k = k + HALF_BOARD_SIZE + 1, counter--) {
    //             if (game[k] === HUMAN_PLAYER) {
    //                 human++;
    //             }
    //             else {
    //                 human = 0;
    //             }
    //             if (game[k] === COMPUTER_PLAYER) {
    //                 computer++;
    //             }
    //             else {
    //                 computer = 0;
    //             }
    //
    //
    //             if (computer === WIN_COMBINATION) {
    //                 return 3;
    //             }
    //             if (human === WIN_COMBINATION) {
    //                 return 2;
    //             }
    //         }
    //     }
    // }


    // Check for tie
    for (let i = 0; i < BOARD_SIZE; i++) {
        if (game[i] !== HUMAN_PLAYER && game[i] !== COMPUTER_PLAYER)
            return 0;
    }

    return 1;

}

function GameOver(game) {
    if (CheckForWinner(game) === 0) {
        return false;
    }
    else if (CheckForWinner(game) === 1) {
        let alert = document.getElementById("turnInfo");
        alert.innerHTML = "It is a tie.";
    }
    else if (CheckForWinner(game) === 2) {
        let alert = document.getElementById("turnInfo");
        alert.innerHTML = "You have won! Congratulations!";
    }
    else {
        let alert = document.getElementById("turnInfo");
        alert.innerHTML = "The computer has won.";
    }
    ShowAverageTime();
    return true;
}

function ShowTimes(time) {
    searchTimes.push(time);
    document.getElementById("searchTime").innerHTML =
        document.getElementById("searchTime").innerHTML + time + " seconds. <br />";
}

function DeleteTimes() {
    searchTimes = [];
    document.getElementById("searchTime").innerHTML = "";
}

function ShowAverageTime() {
    if (showAverageTime) {
        let sum = 0;
        let i = 0;
        for (i; i < searchTimes.length; i++)
            sum += searchTimes[i];

        document.getElementById("searchTime").innerHTML =
            document.getElementById("searchTime").innerHTML + "<br />Average search was <strong>" + sum / i + "</strong> seconds. <br />";
        showAverageTime = false;
    }
}