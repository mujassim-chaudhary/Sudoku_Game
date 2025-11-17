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
let boxStep = document.getElementById("list");
let divTag = document.getElementById("box");

let board = [];
for (let i = 0; i < 9; i++) {
  // to create a 2D Array
  const row = [];
  for (let j = 0; j < 9; j++) {
    row.push(0);
  }
  board.push(row);
}
// to create 2D array for user input board
let userBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
let loadBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
//let savedBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

let i = 0;


// to save the current user board value in the  local storage
function saveProgress(e) {
  let row = Number(e.target.dataset.r);
  let col = Number(e.target.dataset.c);
  let val = Number(e.target.value);
  i++; 
  
  // to load the old data or to create the empty array
  let steps = JSON.parse(localStorage.getItem("steps")) || [];

  function addStep(i, val) {

    if(val === 0){
       // remove last p tag from div
       if(divTag.lastElementChild){
        divTag.removeChild(divTag.lastElementChild);
       }
       
       // remove last element from steps array
       steps.pop();;

       // update the local storage
       localStorage.setItem("steps",JSON.stringify(steps));
       return;
    }

    let pTag = document.createElement("p");
    let stepText = "Step" + i + " = " + val;

    pTag.textContent = stepText;
    divTag.appendChild(pTag);

    steps.push(stepText);
    localStorage.setItem("steps", JSON.stringify(steps));
}

addStep(i,val);


  loadBoard[row][col] = val ? val : 0;

  localStorage.setItem("sudoku-progress", JSON.stringify(loadBoard));
}

// to persist the preFilled sudoku value
function savePuzzle() {
  localStorage.setItem("sudoku-puzzle", JSON.stringify(board));
}

window.addEventListener("load", () => {
  const savedPuzzle = localStorage.getItem("sudoku-puzzle");
  const savedProgress = localStorage.getItem("sudoku-progress");
  const savedSteps = localStorage.getItem("steps");

  if (savedPuzzle) {
    board = JSON.parse(savedPuzzle);
    console.log("🟢 Restored puzzle:", board);
  } else {
    console.log("⚠️ No saved puzzle found.");
  }

  if (savedProgress) {
    loadBoard = JSON.parse(savedProgress);
    console.log("🟢 Restored progress:", loadBoard);
  } else {
    console.log("⚠️ No saved progress found.");
  }

  if(savedSteps){
    let loadSteps = JSON.parse(savedSteps);

    loadSteps.forEach(stepText => {
        let p = document.createElement("p");
        p.textContent = stepText;
        divTag.appendChild(p);
    });

    console.log("🟢 Restored Steps:",loadSteps);
  } else{
    console.log("⚠️ No saved Steps found.");
  }

  buildBoard();
});


// delete or clear the saved progress from local storage;
function clearProgress() {
  localStorage.removeItem("sudoku-progress");
} 

// delete or clear the saved saved puzzle from local storage
function clearSavedPuzzle(){
  localStorage.removeItem("sudoku-puzzle");
}

// delete or clear the saved steps from local storage
function clearSteps(){
  localStorage.removeItem("steps");
}

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

      // to restore the saved input value if avaliable
      if (loadBoard[r][c] !== 0) {
        input.value = loadBoard[r][c];
        input.readOnly = false;
        input.classList.remove("readOnly");
        input.style.background = "#b2e999ff";
      }

      input.addEventListener("keydown", arrowDropdown);

      // To store the input value in the local storage
      input.addEventListener("input", saveProgress);

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

let stopFunction = false;

function fillBoard() {
  // if(stopFunction){
  //   return;
  // }
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
  fillBoard();
  makePuzzle(30);
  savePuzzle();
  buildBoard();
}

function mediumLevel() {
  fillBoard();
  makePuzzle(45);
  savePuzzle();
  buildBoard();
}

mediumBtn.addEventListener("click", mediumLevel);

function hardLevel() {
  fillBoard();
  makePuzzle(60);
  savePuzzle();
  buildBoard();
}

hardbtn.addEventListener("click", hardLevel);

function newgame() {
  // to empty the loadBoard
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      loadBoard[i][j] = 0;
    }
  }
  clearProgress();
  fillBoard();
  makePuzzle(40);
  savePuzzle();
  buildBoard();
 
  // to clear the p tag from local storage and from inside divTag
  divTag.querySelectorAll("p").forEach(p => p.remove());
  i = 0;
  clearSteps();
}

newGameBtn.addEventListener("click", newgame);


// get input value
function getUserBoard() {
  let inputs = document.querySelectorAll("#board input");
  // const userBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

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

  // to empty the loadBoard
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      loadBoard[i][j] = 0;
    }
  }

  
  divTag.querySelectorAll("p").forEach(p => p.remove());
  i = 0;
  clearSteps();


  inputs.forEach((input) => {
    // Only clear if it's NOT a predefined (readonly) cell
    if (!input.readOnly) {
      clearSavedPuzzle();
      clearProgress();
      
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
  // console.log(alertMessage);
  alertBox.style.display = "block";

  let okBtn = document.getElementById("alert-btn");
  okBtn.addEventListener("click", function () {
    alertBox.style.display = "none";
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
    // buildBoard();
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
fillBoard();
makePuzzle();
buildBoard();
