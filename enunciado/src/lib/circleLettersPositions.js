import calculateLetterPositions from "./letter_positions.js";
import { game } from "./gameSetup.js";

// Creación y posición de las letras de la rueda

const letters = game.letters;
const arrayLetters = letters.split("");

let positionLetters = calculateLetterPositions(arrayLetters.length);

let wheelLetters = "";
let positionLetter = 0;
for (const letter of arrayLetters) {
  wheelLetters += `<div class="wheel-letter" style="left: ${positionLetters[positionLetter]["left"]}; top: ${positionLetters[positionLetter]["top"]};">${letter}</div>`;
  positionLetter++;
}

export { wheelLetters };
