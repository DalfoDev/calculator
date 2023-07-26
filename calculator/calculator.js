const resultElement = document.getElementById("result");
let currentInput = "0";
let currentOperator = null;
let previousInput = null;
let calculated = false; // Track whether the last operation resulted in a calculation

const OPERATORS = {
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "×",
  DIVIDE: "÷",
};

function clear() {
  currentInput = "0";
  currentOperator = null;
  previousInput = null;
  calculated = false;
}

function appendNumber(number) {
  if (currentInput === "Error") {
    clear(); // Reset calculator state if there was an error
  }

  if (calculated) {
    currentInput = number;
    calculated = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else {
    currentInput += number;
  }
}

function setOperator(operator) {
  if (currentOperator !== null) {
    calculate();
  }

  if (currentInput === "Error" || currentInput === "undefined") {
    clear(); // Force AC (All Clear) if there was an error or "undefined"
  }

  currentOperator = operator;
  previousInput = currentInput;
  currentInput = "0";
}

function calculate() {
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(current)) {
    currentInput = "Error";
    return;
  }

  if (currentOperator === OPERATORS.DIVIDE && current === 0) {
    currentInput = "undefined";
    currentOperator = null;
    previousInput = null;
    return;
  }

  let result;
  switch (currentOperator) {
    case OPERATORS.ADD:
      result = prev + current;
      break;
    case OPERATORS.SUBTRACT:
      result = prev - current;
      break;
    case OPERATORS.MULTIPLY:
      result = prev * current;
      break;
    case OPERATORS.DIVIDE:
      result = prev / current;
      break;
  }

  if (isNaN(result)) {
    currentInput = "Error";
  } else {
    currentInput = result.toString();
  }

  currentOperator = null;
  previousInput = null;
}

function updateDisplay() {
  resultElement.textContent = currentInput;
}

function updateClearButton() {
  const clearButton = document.getElementById("clear");
  clearButton.textContent = currentInput !== "0" ? "C" : "AC";
}

function clearEntry() {
  if (currentInput === "Error") {
    clear(); // Reset calculator state if there was an error
  } else {
    currentInput = "0";
    updateClearButton();
  }
}

function backspace() {
  if (currentInput === "0" || currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith("-"))) {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
  }
}

function toggleSign() {
  if (currentInput !== "0") {
    currentInput = (parseFloat(currentInput) * -1).toString();
    if (calculated) {
      previousInput = currentInput;
      calculated = false;
    }
  }
}

function resetOperatorButtons() {
  const operatorButtons = document.querySelectorAll(".operator");
  operatorButtons.forEach(button => {
    button.classList.remove("active-operator");
  });
}

function handleOperatorButtonClick(event) {
  const operator = event.target.textContent;

  resetOperatorButtons();
  event.target.classList.add("active-operator");
  setOperator(operator);

  updateDisplay();
}

function handleNumberButtonClick(event) {
  const number = event.target.textContent;

  appendNumber(number);

  updateDisplay();
  updateClearButton();
}

function handleSpecialButtonClick(event) {
  const buttonValue = event.target.textContent;

  if (buttonValue === "C") {
    clearEntry();
  } else if (buttonValue === "AC" || isNaN(parseFloat(currentInput))) {
    clear();
  } else if (buttonValue === "=") {
    calculate();
    resetOperatorButtons();
    calculated = true;
  } else if (buttonValue === "⌫") {
    backspace();
  } else if (buttonValue === "+/-") {
    toggleSign();
  }
  // Handle decimal button, if present
  else if (buttonValue === ".") {
    inputDecimal(); // You need to define this function if you want decimal support.
  }

  updateDisplay();
  updateClearButton();
}

function handleButtonClick(event) {
  const buttonValue = event.target.textContent;

  if (currentInput === "Error") {
    currentInput = "0"; // Reset current input if there was an error
  }

  if (Object.values(OPERATORS).includes(buttonValue)) {
    handleOperatorButtonClick(event);
  } else if (!isNaN(parseFloat(buttonValue)) || buttonValue === ".") {
    handleNumberButtonClick(event);
  } else {
    handleSpecialButtonClick(event);
  }

  updateDisplay();
  updateClearButton();
}

const buttons = document.querySelectorAll(".num, .operator, #clear, #all-clear, #backspace, #toggle-sign");
buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

updateDisplay();
updateClearButton();
