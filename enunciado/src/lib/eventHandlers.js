import { game, despX, despY, positionTracker } from "./gameSetup.js";
import { getElementCenter, lengthAndAngle } from "./line_position.js";

let currentLine = null;
let arraySelectedLetters = [];
let isSelecting = false;
let lines = [];
let word = "";

function newLine(letter) {
  const line = document.createElement("div");
  line.className = "line";
  const center = getElementCenter(letter);
  line.style.left = `${center.x}px`;
  line.style.top = `${center.y}px`;
  document.body.appendChild(line);
  return line;
}

function updateCurrentLine(lastCenter, mouseX, mouseY) {
  const { length, angle } = lengthAndAngle(
    [lastCenter.x, lastCenter.y],
    [mouseX, mouseY]
  );
  if (currentLine) {
    currentLine.style.width = `${length}px`;
    currentLine.style.transform = `rotate(${angle}deg)`;
  }
}

function getLetterUnderMouse(mouseX, mouseY) {
  const letter = document.elementFromPoint(mouseX, mouseY);
  if (
    letter &&
    letter.classList.contains("wheel-letter") &&
    !letter.classList.contains("selected")
  ) {
    word += letter.innerHTML;
    return letter;
  }
  return null;
}

function revealLetter() {
  if (positionTracker.length === 0) {
    return;
  }

  let position;
  let cell;
  let randomIndex;

  while (positionTracker.length > 0) {
    randomIndex = Math.floor(Math.random() * positionTracker.length);
    position = positionTracker[randomIndex];
    const [row, col] = position.split(" / ").map(Number);

    const adjustedCol = col - despX - 1;
    const adjustedRow = row - despY - 1;
    const letter = game.letterAt(adjustedCol, adjustedRow);
    cell = document.querySelector(
      `.letter[style*="grid-area: ${row} / ${col}"]`
    );

    if (cell && cell.innerHTML === "") {
      cell.innerHTML = letter;
      positionTracker.splice(randomIndex, 1);
      break;
    } else {
      positionTracker.splice(randomIndex, 1);
    }
  }
}

function handleShuffle() {
  const divLetters = [...document.querySelectorAll(".wheel-letter")];
  let divStyle = [];

  for (const div of divLetters) {
    divStyle.push(div.getAttribute("style"));
  }

  divStyle.sort(() => Math.random() - 0.5);

  for (let i = 0; i < divLetters.length; i++) {
    divLetters[i].style = divStyle[i];
  }

  return divLetters;
}

function removeHammerHelp() {
  const divBlack = document.getElementById("black");
  const divLetters = document.querySelectorAll(".letter");

  divBlack.classList.add("hidden");

  for (const letter of divLetters) {
    letter.classList.remove("on-top");
  }
}

function revealLetterByHammer(event) {
  const divLetters = document.querySelectorAll(".letter");
  const letter = event.currentTarget;

  const row = letter.getAttribute("data-y");
  const col = letter.getAttribute("data-x");

  const letterInCell = game.letterAt(col, row);
  const cell = document.querySelector(`div[data-x="${col}"][data-y="${row}"]`);

  if (cell.innerHTML === "") {
    cell.innerHTML = letterInCell;
  }

  removeHammerHelp();

  divLetters.forEach((element) => {
    element.removeEventListener("mouseup", revealLetterByHammer);
  });
}

function handleHammer() {
  const divBlack = document.getElementById("black");
  const divLetters = document.querySelectorAll(".letter");

  divBlack.classList.remove("hidden");

  divBlack.addEventListener("click", (event) => {
    if (divBlack.contains(event.target)) {
      divLetters.forEach((element) => {
        element.removeEventListener("mouseup", revealLetterByHammer);
      });
      removeHammerHelp();
    }
  });

  for (const letter of divLetters) {
    letter.classList.add("on-top");

    if (letter.innerHTML === "") {
      letter.addEventListener("mouseup", revealLetterByHammer);
    }
  }
}

export function attachWheelEvents() {
  const lettersIntheWheel = document.querySelectorAll(".wheel-letter");
  const toolShuffle = document.querySelector(".fa-shuffle").parentElement;
  const toolLightbulb = document.querySelector(".fa-lightbulb").parentElement;
  const toolExpand = document.querySelector(".fa-expand").parentElement;
  const toolHammer = document.querySelector(".fa-hammer").parentElement;

  lettersIntheWheel.forEach((letter) => {
    letter.addEventListener("mousedown", (event) => {
      isSelecting = true;
      if (!event.target.classList.contains("selected")) {
        event.target.classList.add("selected");
        word = event.target.innerHTML;
        arraySelectedLetters.push(event.target);
        currentLine = newLine(event.target);
        lines.push(currentLine);
      }
    });
  });

  const handleMouseMove = (event) => {
    if (isSelecting) {
      const lastSelected =
        arraySelectedLetters[arraySelectedLetters.length - 1];
      const lastCenter = getElementCenter(lastSelected);

      updateCurrentLine(lastCenter, event.clientX, event.clientY);

      const letterUnderMouse = getLetterUnderMouse(
        event.clientX,
        event.clientY
      );
      if (letterUnderMouse) {
        letterUnderMouse.classList.add("selected");
        arraySelectedLetters.push(letterUnderMouse);
        const newCenter = getElementCenter(letterUnderMouse);
        updateCurrentLine(lastCenter, newCenter.x, newCenter.y);
        currentLine = newLine(letterUnderMouse);
        lines.push(currentLine);
      }
    }
  };

  const handleMouseUp = () => {
    isSelecting = false;
    arraySelectedLetters.forEach((letter) =>
      letter.classList.remove("selected")
    );
    arraySelectedLetters = [];
    lines.forEach((line) => line.remove());
    lines = [];
    if (word) {
      let wordFound;
      try {
        wordFound = game.findWord(word);
      } catch (error) {
        console.log(error);
        word = "";
        return;
      }
      const letters = word.split("");
      word = "";
      if (wordFound) {
        const direction = wordFound["direction"];
        const column = wordFound["origin"][0];
        const row = wordFound["origin"][1];

        letters.forEach((letter, index) => {
          const finalRow = row + (direction === "vertical" ? index : 0) + despY;
          const finalCol =
            column + (direction === "horizontal" ? index : 0) + despX;

          const cell = document.querySelector(
            `.letter[style*="grid-area: ${finalRow + 1} / ${finalCol + 1}"]`
          );
          cell.innerHTML = letter;
        });
      }
    }
  };

  document.addEventListener("mousemove", handleMouseMove);

  document.addEventListener("mouseup", handleMouseUp);

  toolShuffle.addEventListener("mouseup", handleShuffle);

  toolLightbulb.addEventListener("mouseup", revealLetter);

  toolExpand.addEventListener("mouseup", () => {
    const lettersRevealed =
      positionTracker.length <= 5 ? positionTracker.length : 5;

    for (let i = 0; i < lettersRevealed; i++) {
      revealLetter();
    }
  });

  toolHammer.addEventListener("click", handleHammer);
}
