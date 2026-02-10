const WORD_OF_THE_DAY_URL =
  "https://words.dev-apis.com/word-of-the-day?random=true";
const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word";

const errorElement = document.querySelector(".error");
const inputElement = document.querySelector(".input");
const guessElement = document.querySelector(".guess");
const validElement = document.querySelector(".valid");
const wonElement = document.querySelector(".won");
const againElement = document.querySelector(".again");
const hintElement = document.querySelector(".first-letter-hint");

let wordOfTheDay;
let correctLetterCounter = 0;

async function getWord() {
  try {
    const promise = await fetch(WORD_OF_THE_DAY_URL);

    if (!promise.ok) {
      errorElement.textContent = "Error found";
      errorElement.classList.remove("hidden");
      return;
    }

    const { word } = await promise.json();
    wordOfTheDay = word;
    hintElement.textContent = wordOfTheDay[0];
  } catch (error) {
    errorElement.textContent = "Error found: " + error;
  }
}

async function validateWord(inputValue) {
  const promise = await fetch(VALIDATE_WORD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word: inputValue }),
  });
  const { validWord } = await promise.json();

  return validWord;
}

function getInputWord() {
  return inputElement.value;
}

function createElementByColor(textContent, color) {
  const span = document.createElement("span");
  span.textContent = textContent;

  switch (color) {
    case "green":
      span.classList.add("green");
      break;
    case "yellow":
      span.classList.add("yellow");
      break;
    case "red":
      span.classList.add("red");
      break;

    default:
      break;
  }

  return span;
}

function wordle(wordOfTheDay, inputValue) {
  const targetLetters = wordOfTheDay.split("");
  const inputLetters = inputValue.split("");
  const resultSpans = new Array(inputLetters.length);

  // Create a map to count how many letter exists in the target
  const letterCounts = {};
  for (let letter of targetLetters) {
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  }
  console.log(letterCounts);

  for (let i = 0; i < inputLetters.length; i++) {
    if (inputLetters[i] === targetLetters[i]) {
      resultSpans[i] = createElementByColor(inputLetters[i], "green");
      letterCounts[inputLetters[i]]--;
      correctLetterCounter += 1;
    }
  }

  for (let i = 0; i < inputLetters.length; i++) {
    // Skip if we already marked this index as green
    if (resultSpans[i]) continue;

    const currentLetter = inputLetters[i];

    // If letter exists in target and we still have "count" left for it
    if (
      targetLetters.includes(currentLetter) &&
      letterCounts[currentLetter] > 0
    ) {
      resultSpans[i] = createElementByColor(currentLetter, "yellow");
      letterCounts[currentLetter]--;
    } else {
      resultSpans[i] = createElementByColor(currentLetter, "red");
    }
  }

  return resultSpans;
}

getWord();

const value = inputElement.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const inputValue = getInputWord();

    const valid = await validateWord(inputValue);
    if (!valid) {
      validElement.textContent = `${inputValue} is not a valid word!`;
      validElement.classList.remove("hidden");
      return;
    } else validElement.classList.add("hidden");

    correctLetterCounter = 0;

    const result = wordle(wordOfTheDay, inputValue);

    const div = document.createElement("div");
    result.forEach((element) => {
      div.append(element);

      guessElement.appendChild(div);
    });

    if (correctLetterCounter === wordOfTheDay.length) {
      wonElement.textContent = `You guessed the correct word! ${wordOfTheDay}`;
      wonElement.classList.remove("hidden");
      againElement.classList.remove("hidden");
      inputElement.disabled = true;
    }
  }
});

againElement.addEventListener("click", () => {
  location.reload();
});
