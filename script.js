let boardEl = document.getElementById("board");
let newGameBtn = document.getElementById("new");
let resetBtn = document.getElementById("reset");
let checkBtn = document.getElementById("check");
let messageEl = document.getElementById("message");
let inputs = document.querySelectorAll("#board input");
let easyBtn = document.getElementById("easy");
let mediumBtn = document.getElementById("medium");
let hardbtn = document.getElementById("hard");
let giveUpbtn = document.getElementById("giveUp-btn");

let board = [];
for (let i = 0; i < 9; i++) {
  // to create a 2D Array
  const row = [];
  for (let j = 0; j < 9; j++) {
    row.push(0);
  }
  board.push(row);
}

// console.log(board);

function buildBoard() {
  boardEl.innerHTML = "";

  // create 81 cell
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let idx = r * 9 + c; // to get the index in the flatten array

      let input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.dataset.r = r;
      input.dataset.c = c;
      input.inputMode = "numeric"; // to open a numeric pad in mobile
      input.autocomplete = "off";
      input.style.background = "#b2e999ff";

      if (board[r][c] !== 0) {
        input.value = board[r][c];
       // input.disabled = true; // prefilled numbers not editable
        input.readOnly = true;
        input.classList.add("readonly");
        input.style.backgroundColor = "#de7373ff";
      }

      input.addEventListener("keydown", arrowDropdown);

      boardEl.appendChild(input);
    }
  }
}

// keyBoard arrow dropdown
function arrowDropdown(e) {
  let input = e.target;
  let row = Number(input.dataset.r);
  let col = Number(input.dataset.c);
  console.log(col);
  let nextRow = row;
  let nextCol = col;

  switch (e.key) {
    case "ArrowUp": {
      nextRow = row > 0 ? row - 1 : row;
      break;
    }
    case "ArrowDown": {
      nextRow = row < 8 ? row + 1 : row;
      break;
    }
    case "ArrowLeft": {
      nextCol = col > 0 ? col - 1 : col;
      break;
    }
    case "ArrowRight": {
      nextCol = col < 8 ? col + 1 : col;
      break;
    }
    default: {
      return;
    }
  }

  let nextInput = document.querySelector(
    // To select the
    `input[data-r ="${nextRow}"][data-c = "${nextCol}"]`
  );

  if (nextInput) {
    e.preventDefault();
    // input.disabled = false;
    nextInput.focus();
  }
}

// this is sudoku check helper function
function isSafe(row, col, num) {
  // Row check
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Column check
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // 3x3 box check
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

function fillBoard() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of nums) {
          if (isSafe(row, col, num)) {
            board[row][col] = num;
            if (fillBoard()) {
              return true;
            } else {
              board[row][col] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

// reShuffle the array element
function shuffle(arr) {
  let rearr = arr.sort(() => Math.random() - 0.5);
  // console.log(rearr);
  return rearr;
}

// Make the puzzle empty
function makePuzzle(emptyCells = 40) {
  let count = emptyCells;
  while (count > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      count--;
    }
  }
  return board;
}

console.log(easyBtn.addEventListener("click", easyLevel));
// To select the level of the sudoku game
function easyLevel() {
  buildBoard();
  fillBoard();
  makePuzzle(30);
  buildBoard();
  // fillBoard();
}



function mediumLevel() {
  buildBoard();
  fillBoard();

  makePuzzle(45);
  buildBoard();
  // fillBoard();
}

mediumBtn.addEventListener("click", mediumLevel);

function hardLevel() {
  buildBoard();
  fillBoard();
  makePuzzle(60);
  buildBoard();
  // fillBoard();
}

hardbtn.addEventListener("click", hardLevel);

function newgame() {
  buildBoard();
  fillBoard();
  makePuzzle(40);
  messageEl.textContent = "";
  buildBoard();
  // fillBoard();
}

newGameBtn.addEventListener("click", newgame);

// get input value
function getUserBoard() {
  let inputs = document.querySelectorAll("#board input");
  const userBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

  inputs.forEach((input) => {
    const r = Number(input.dataset.r);
    const c = Number(input.dataset.c);
    const val = input.value;
    // console.log(`r=${r}, c=${c}, val=${val}`);

    userBoard[r][c] = val ? Number(val) : 0;
  });

  // console.log(userBoard);
  return userBoard;
}

function checkSolution() {
  let userBoard = getUserBoard();
  //console.log(userBoard);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let num = userBoard[r][c];
      if (num === 0 || !isSafeForCheck(userBoard, r, c, num)) {
        // messageEl.textContent = "❌ Incorrect or Incomplete!";
        // messageEl.style.color = "red";
        showAlert("❌ Incorrect or Incomplete!");
        return;
      }
    }
  }
  // messageEl.textContent = "✅ Congratulations! Sudoku Solved!";
  // messageEl.style.color = "green";
  showAlert("✅ Congratulations! Sudoku Solved!");
}

// A version of isSafe that works for full user board checking
function isSafeForCheck(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x] === num) return false;
  }

  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col] === num) return false;
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = startRow + i;
      const c = startCol + j;
      if ((r !== row || c !== col) && board[r][c] === num) return false;
    }
  }

  return true;
}

// to check output
checkBtn.addEventListener("click", checkSolution);

resetBtn.addEventListener("click", () => {
  let inputs = document.querySelectorAll("#board input");
  inputs.forEach((input) => {
    // Only clear if it's NOT a predefined (readonly) cell
    if (!input.readOnly) {
      input.value = "";
    }
  });
});

// custom alert pop
function showAlert(message) {
  let alertBox = document.getElementById("custom-alert");
  let alertMessage = document.getElementById("alert-message");

  alertMessage.textContent = message;
  alertMessage.style.color = "red";
  console.log(alertMessage);
  alertBox.style.display = "block";

  let okBtn = document.getElementById("alert-btn");
  okBtn.addEventListener("click", function () {
    alertBox.style.display = "none";
    // buildBoard();
    // fillBoard();
    // // makePuzzle(0);
    // buildBoard();
  });
}

function showGiveUpAlert(message) {
  let alertBox = document.getElementById("custom-alert1");
  let alertMessage = document.getElementById("alert-message1");

  alertMessage.textContent = message;
  alertMessage.style.color = "red";
  console.log(alertMessage);
  alertBox.style.display = "block";

  let okBtn = document.getElementById("alert-btn1");
  okBtn.addEventListener("click", function () {
    alertBox.style.display = "none";
    buildBoard();
    fillBoard();
    makePuzzle(0);
    buildBoard();
  });
}  

 // give Functionality
function giveUp() {
  showGiveUpAlert("give up!");
}

giveUpbtn.addEventListener("click", giveUp);

buildBoard();
fillBoard();
makePuzzle();
buildBoard();
