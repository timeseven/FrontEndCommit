const letters = document.querySelectorAll(".gameboard-letter");
const loadingDiv = document.querySelector(".loading");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init() {
  // the state
  let currentGuess = "";
  let currentRow = 0;
  let isLoading = true;
  let done = false;

  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const { word: wordRes } = await res.json();
  const word = wordRes.toUpperCase();
  const wordParts = word.split("");

  isLoading = false;
  setLoading(isLoading);
  console.log("word::::", word);

  // user adds a letter to the current guess
  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      // add letter to the end
      currentGuess += letter;
    } else {
      // replace the last letter
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }
    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
  }

  // user trys to enter a word
  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      return;
    }
    isLoading = true;
    setLoading(isLoading);
    // validate the word
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });

    const { validWord } = await res.json();
    isLoading = false;
    setLoading(isLoading);
    console.log("validWord::::", validWord);
    // not valid, mark the word as invalid and return
    if (!validWord) {
      markInvalidWord();
      return;
    }

    // do all the marking as "corret", "close" and "wrong"
    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);
    let allRight = true;

    // first pass just finds correct letters so we can mark those as
    // correct first
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        // mark as correct
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--;
      }
    }

    // second pass finds close and wrong letters
    // we use the map to make sure we mark the correct amount of
    // close letters
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        // do nothing
      } else if (map[guessParts[i]] && map[guessParts[i]] > 0) {
        // mark as close
        allRight = false;
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
        map[guessParts[i]]--;
      } else {
        // wrong
        allRight = false;
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }

    currentRow++;
    currentGuess = "";
    console.log("currentRow:::", currentRow, "ROUNDS:::::", ROUNDS);
    // result
    if (allRight) {
      // win
      alert("you win!");
      document.querySelector(".gamename").classList.add("winner");
      done = true;
    } else if (currentRow === ROUNDS) {
      console.log("alert wrong");
      alert(`you lose, the word was ${word}`);
      done = true;
    }
  }

  function backspace() {
    //remove the last letter
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    // fill empty string to the last letter
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
  }

  // validation
  function markInvalidWord() {
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");

      // long enough for the browser to repaint without the "invalid class" so we can then add it again
      setTimeout(() => letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid"), 50);
    }
  }

  document.addEventListener("keydown", function handleKeyPress(event) {
    if (done || isLoading) {
      return;
    }
    const action = event.key;
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

function setLoading(isLoading) {
  loadingDiv.classList.toggle("hidden", !isLoading);
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    let letter = array[i];
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }
  return obj;
}

init();
