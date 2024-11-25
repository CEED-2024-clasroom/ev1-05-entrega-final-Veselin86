import { Game } from "./Game.js";
import center from "./center.js";

const game = new Game();

//Centrado de las casillas del juego

const wordPositions = game.wordPositions;
const gridHeight = 10;
const gridWidth = 10;

let maxRow = 0;
let maxColumn = 0;

for (const posicion of wordPositions) {
  const column = posicion.origin[0] + (posicion.direction === "horizontal" ? posicion.length - 1 : 0);
  const row = posicion.origin[1] + (posicion.direction === "vertical" ? posicion.length - 1 : 0);

  if (column > maxColumn) {
    maxColumn = column;
  }

  if (row > maxRow) {
    maxRow = row;
  }
}

const centrado = center(maxColumn, maxRow, gridWidth, gridHeight);

let despX = centrado[0];
let despY = centrado[1];
let positionTracker = [];

const posiciones = wordPositions.map(({ origin, direction, length }) => {
  const html = [];
  for (let i = 0; i < length; i++) {
    const row = origin[1] + (direction === "vertical" ? i : 0) + despY;
    const col = origin[0] + (direction === "horizontal" ? i : 0) + despX;
    const dataX = col - despX;
    const dataY = row - despY;
    const position = `${row + 1} / ${col + 1}`;
    if (!positionTracker.includes(position)) {
      html.push(
        `<div data-x="${dataX}" data-y="${dataY}" class="letter" style="grid-area: ${position};"></div>`
        // `<div class="letter" style="grid-area: ${row + 1} / ${col + 1};"></div>`
      );
      positionTracker.push(position);
    }
  }
  return html.join("");
});
const flattenedPosiciones = posiciones.flat().join("");

export { game, flattenedPosiciones as posiciones, despX, despY, positionTracker };
