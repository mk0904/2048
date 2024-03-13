function createBoard() {
  let gridDiv = document.querySelector(".grid");
  for (let i = 0; i < 16; i++) {
    let div = document.createElement("div");
    div.setAttribute("id", `id_${i}`);
    div.textContent = 0;
    gridDiv.appendChild(div);
  }
}

createBoard();

function generate() {
  let numArray = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
  let num = numArray[Math.floor(Math.random() * numArray.length)];
  let allBlocks = document.querySelectorAll(".grid > div");
  let filterBlocks = [...allBlocks].filter((a) => a.textContent == 0);
  if (filterBlocks.length == 0) {
    return;
  }
  let finalBlock = filterBlocks[Math.floor(Math.random() * filterBlocks.length)];
  finalBlock.textContent = num;
}

generate();
generate();

function shiftArrayLeft(values) {
  let finalArray = values.filter((a) => a != 0);
  let index = finalArray.length;
  while (index < 4) {
    finalArray.push(0);
    index++;
  }
  return mergeTiles(finalArray);
}

function shiftArrayRight(values) {
  let finalArray = values.filter((a) => a != 0);
  let index = finalArray.length;
  while (index < 4) {
    finalArray.unshift(0);
    index++;
  }
  return mergeTiles(finalArray);
}

function shiftArrayUp(values) {
  let finalArray = values.filter((a) => a != 0);
  let index = finalArray.length;
  while (index < 4) {
    finalArray.push(0);
    index++;
  }
  return mergeTiles(finalArray);
}

function shiftArrayDown(values) {
  let finalArray = values.filter((a) => a != 0);
  let index = finalArray.length;
  while (index < 4) {
    finalArray.unshift(0);
    index++;
  }
  return mergeTiles(finalArray);
}

function shiftRow(rowNumber, direction) {
  let rowValues = [];
  for (let i = 4 * (rowNumber - 1); i < 4 * rowNumber; i++) {
    rowValues.push(parseInt(document.querySelector(`#id_${i}`).textContent, 10));
  }
  if (direction === "L") {
    rowValues = shiftArrayLeft(rowValues);
  } else if (direction === "R") {
    rowValues = shiftArrayRight(rowValues);
  }
  for (let i = (rowNumber - 1) * 4; i < 4 * rowNumber; i++) {
    document.querySelector(`#id_${i}`).textContent = rowValues[i % 4];
  }
}

function shiftColumn(columnNumber, direction) {
  let columnValues = [];
  for (let i = columnNumber - 1; i < 16; i += 4) {
    columnValues.push(parseInt(document.querySelector(`#id_${i}`).textContent, 10));
  }
  if (direction === "U") {
    columnValues = shiftArrayUp(columnValues);
  } else if (direction === "D") {
    columnValues = shiftArrayDown(columnValues);
  }
  for (let i = columnNumber - 1, j = 0; i < 16; i += 4, j++) {
    document.querySelector(`#id_${i}`).textContent = columnValues[j];
  }
}

function shiftLeft() {
  for (let row = 1; row <= 4; row++) {
    shiftRow(row, "L");
  }
}

function shiftRight() {
  for (let row = 1; row <= 4; row++) {
    shiftRow(row, "R");
  }
}

function shiftUp() {
  for (let column = 1; column <= 4; column++) {
    shiftColumn(column, "U");
  }
}

function shiftDown() {
  for (let column = 1; column <= 4; column++) {
    shiftColumn(column, "D");
  }
}

function mergeTiles(rowValues) {
  for (let i = 0; i < rowValues.length - 1; i++) {
    if (rowValues[i] === rowValues[i + 1]) {
      rowValues[i] *= 2;
      rowValues[i + 1] = 0;
      updateScore(rowValues[i]);
      document.querySelector(`#id_${i + 1}`).classList.add('merged');
    }
  }
  return rowValues;
}

function updateScore(mergedValue) {
  let scoreElement = document.querySelector("#score");
  let newScore = parseInt(scoreElement.textContent, 10) + mergedValue;
  scoreElement.textContent = newScore;
}

function handleKeyPress(event) {
  const keyCode = event.keyCode;
  let direction;
  switch (keyCode) {
    case 37:
      direction = "L";
      break;
    case 38:
      direction = "U";
      break;
    case 39:
      direction = "R";
      break;
    case 40:
      direction = "D";
      break;
    default:
      return;
  }
  switch (direction) {
    case "L":
      shiftLeft();
      break;
    case "U":
      shiftUp();
      break;
    case "R":
      shiftRight();
      break;
    case "D":
      shiftDown();
      break;
  }
  if (checkForWin()) {
    document.querySelector("#result").textContent = "YOU WIN!";
    document.removeEventListener("keyup", handleKeyPress)
  } else if (isGameOver()) {
    document.querySelector("#result").textContent = "Game Over";
    document.removeEventListener("keyup", handleKeyPress);
  } else {
    generate();
  }
}

document.addEventListener("keyup", handleKeyPress);

function isGameOver() {
  let allBlocks = document.querySelectorAll(".grid > div");
  let emptySquares = Array.from(allBlocks).filter(
    (block) => block.textContent == 0
  );
  if (emptySquares.length == 0) {
    return true;
  }
  for (let i = 0; i < 16; i++) {
    let currentBlock = document.querySelector(`#id_${i}`);
    let currentValue = parseInt(currentBlock.textContent, 10);
    if (i % 4 !== 3) {
      let rightValue = parseInt(
        document.querySelector(`#id_${i + 1}`).textContent,
        10
      );
      if (currentValue === rightValue) {
        return false;
      }
    }
    if (i < 12) {
      let downValue = parseInt(
        document.querySelector(`#id_${i + 4}`).textContent,
        10
      );
      if (currentValue === downValue) {
        return false;
      }
    }
  }
  return true;
}

function checkForWin() {
  for (let i = 0; i < 16; i++) {
    let currentBlock = document.querySelector(`#id_${i}`);
    let currentValue = parseInt(currentBlock.textContent, 10);
    if (currentValue === 2048) {
      return true;
    }
  }
  return false;
}

function restartGame() {
  let allBlocks = document.querySelectorAll(".grid > div");
  allBlocks.forEach((block) => {
    block.textContent = 0;
  });
  let scoreElement = document.querySelector("#score");
  scoreElement.textContent = 0;
  document.querySelector("#result").textContent = "Join the numbers and get to the 2048 tile!";
  createBoard();
  generate()
  generate()
  document.addEventListener("keyup", handleKeyPress);
}

document.getElementById("restart-button").addEventListener("click", function() {
  restartGame();
});
