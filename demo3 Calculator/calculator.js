let buffer = "0";
const screen = document.querySelector(".calScreen");
let result = 0;
let preOperator;

function render() {
  screen.innerText = buffer;
}

function handleOperator(value) {
  if (preOperator === "-") {
    result -= value;
  } else if (preOperator === "+") {
    result += value;
  } else if (preOperator === "÷") {
    result /= value;
  } else {
    result *= value;
  }
}

function doMath(value) {
  if (buffer === "0") {
    return;
  }
  console.log("xxxxx", value, buffer, result, preOperator);

  const preBuffer = parseInt(buffer);
  if (result === 0) {
    result = preBuffer;
  } else {
    handleOperator(preBuffer);
  }

  preOperator = value;

  buffer = "0";
}

function handleSymbol(value) {
  // what gonna do when hit symbol
  switch (value) {
    case "C":
      buffer = "0";
      result = 0;
      break;
    case "←":
      if (buffer.length > 1) {
        buffer = buffer.substring(0, buffer.length - 1);
      } else {
        buffer = "0";
      }
      break;
    case "÷":
    case "×":
    case "-":
    case "+":
      doMath(value);
      break;
    case "=":
      if (preOperator === null) {
        return;
      }
      handleOperator(parseInt(buffer));
      preOperator = null;
      console.log(result, "xxxx", typeof result);
      buffer = result;
      result = 0;
      console.log(buffer, typeof buffer, "buffffff");
      break;
  }
}

function handleNumber(value) {
  // what gonna do when hit number button
  console.log(preOperator != null, "sdfsdfsdf");
  if (buffer === "0") {
    buffer = value;
  } else {
    buffer += value;
  }
}

function handleButton(value) {
  //figure out the type of the values and deal with them seperatelly
  if (isNaN(parseInt(value))) {
    handleSymbol(value);
  } else {
    handleNumber(value);
  }
  render();
}

function init() {
  document.querySelector(".calButtons").addEventListener("click", function (event) {
    // add eventlistener for clicking
    if (event.target.localName === "button") {
      handleButton(event.target.innerText);
    }
  });
}

init();
