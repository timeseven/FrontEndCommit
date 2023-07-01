const letters = document.querySelectorAll(".gameboard-letter");
const loading = document.querySelector(".loading");
const ANSWER_LENGTH = 5;

async function init() {
  let currentGuess = "";
  let currentRow = 0;

  function addLetter(letter) {
    console.log("letter", letter);
    console.log("currentGuess", currentGuess.length);
    if (currentGuess.length < ANSWER_LENGTH) {
      // add letter to the end
      currentGuess += letter;
    } else {
      // replace the last letter
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }
    console.log(":::::", currentGuess.length);
    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
  }

  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      return;
    }
    // validate the word

    // do all the marking as "corret", "close" and "wrong"

    // did they win or lose?

    currentRow++;
    currentGuess = "";
  }

  function backspace() {
    //remove the last letter
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    // fill empty string to the last letter
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
  }

  document.addEventListener("keydown", function handleKeyPress(event) {
    const action = event.key;
    console.log("action:::", action, "currentRow:::", currentRow);
    if (action === "Enter") {
      console.log("commit>>>>>");
      commit();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // do nothing
    }
  });
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}
init();
