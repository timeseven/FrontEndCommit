const letters = document.querySelectorAll(".gameboard-letter");
const loading = document.querySelector(".loading");

async function init() {
  document.addEventListener("keydown", function handleKeyPress(event) {
    const action = event.key;

    console.log("action", action);
  });
}

init();
