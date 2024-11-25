import "./styles/styles.css";
import "./lib/fontawesome.js";
import { posiciones } from "./lib/gameSetup.js";
import { wheelLetters } from "./lib/circleLettersPositions.js";
import { attachWheelEvents } from "./lib/eventHandlers.js";

document.querySelector("#app").innerHTML = `
 <div id="game">
    
    <div id="black" class="hidden"></div>

    <section id="word-grid">
      <div id="grid">${posiciones}</div>
    </section>

    <section id="controls">

      <div class="tools left">
        <div class="tool"><i class="tool-icon fa-solid fa-shuffle"></i></div>
        <div class="tool"><i class="tool-icon fa-solid fa-expand"></i></div>
      </div>
    
      <div id="wheel-container">
        <div id="wheel">
          <!-- The letters will be here -->
          ${wheelLetters}
        </div>
      </div>
      
      <div class="tools right">
        <div class="tool"><i class="tool-icon fa-solid fa-lightbulb"></i></div>
        <div class="tool"><i class="tool-icon fa-solid fa-hammer"></i></div>
      
        </div>
    
    </section>

 </div>`;
 
 attachWheelEvents()

