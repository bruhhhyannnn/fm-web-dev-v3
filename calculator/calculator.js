const initialResultElement = document.querySelector(".initial-result");
const resultElement = document.querySelector(".result");

let operands = [];
let operators = [];
let resultValue = 0;
let anotherCalculation = false;

function calculateArithmetic(firstOperand, operator, secondOperand) {
  switch (operator) {
    case "+":
      return firstOperand + secondOperand;
    case "-":
      return firstOperand - secondOperand;
    case "*":
      return firstOperand * secondOperand;
    case "/":
      return firstOperand / secondOperand;
    default:
      return 0;
  }
}

document.querySelector(".calculator").addEventListener("click", (e) => {
  if (!e.target.matches("button")) {
    return;
  }

  const buttonText = e.target.innerText;

  switch (buttonText) {
    case "+":
    case "-":
    case "*":
    case "/":
      operands.push(parseInt(resultElement.textContent));
      operators.push(buttonText);

      // first condition: Prevent from adding the placeholder 0 in both initialResult and result
      // second condition: For resetting the text content from a recent calculation
      if (initialResultElement.textContent === "0" || anotherCalculation) {
        initialResultElement.textContent = `${resultElement.textContent} ${buttonText}`;
        anotherCalculation = false;
      } else
        initialResultElement.textContent = `${initialResultElement.textContent} ${resultElement.textContent} ${buttonText}`;
      resultElement.textContent = "0";
      break;

    case "=":
      // Prevent from calculating if no operators
      if (operators.length === 0) {
        initialResultElement.textContent = resultElement.textContent;
        break;
      }

      // Push the remaining or second operand
      operands.push(parseInt(resultElement.textContent));

      for (const [index, operand] of operands.entries()) {
        // first condition: Handle case to calculate only if their is a next operand, otherwise stop calculating
        // second condition: Condition if next operand is number 0, then mark it as true value rather than false. Compiler values number 0 as false.
        if (operands[index + 1] || operands[index + 1] === 0) {
          // Handle case for division of zero
          if (operators[index] === "/" && operands[index + 1] === 0) {
            resultValue = "Cannot divide by zero dum dum";
            break;
          }

          resultValue = calculateArithmetic(
            operand,
            operators[index],
            operands[index + 1],
          );

          operands[index + 1] = resultValue;
        }
      }

      initialResultElement.textContent = `${initialResultElement.textContent} ${resultElement.textContent} = ${resultValue}`;
      resultElement.textContent = resultValue;

      // Reset values for another calculation
      operands = [];
      operators = [];
      // For resetting the text content of the initialResult
      anotherCalculation = true;
      break;

    case "C":
      operands = [];
      operators = [];
      resultValue = 0;
      initialResultElement.textContent = 0;
      resultElement.textContent = 0;
      break;

    case "←":
      resultElement.textContent =
        // Fallback to character 0 if backspaced till the last number
        resultElement.textContent.length === 1
          ? "0"
          : resultElement.textContent.slice(0, -1);
      break;

    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      resultElement.textContent =
        // Prevent from inputting bunch of zeros, instead just fallback to character 0
        resultElement.textContent === "0"
          ? buttonText
          : resultElement.textContent + buttonText;
      break;

    default:
      break;
  }
});
