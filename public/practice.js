import { State } from "./state.js";
import { drawKmap, labelCells, getKmapInput, getSolution, VALUES, LENGTH } from "./utils.js";

let globalSolution;

console.log("practice.js loaded");


function randomizeKmap(state) {

    let cells = state.getCells();

    for (let cell of cells) {
    // Replace the value of each cell with a random value from VALUES
    cell.children[0].innerHTML = VALUES[Math.floor(Math.random() * LENGTH)];
    }

    // Add "1" in a random position, so that the kmap is guaranteed to be valid
    let randPos = Math.floor(Math.random() * cells.length);
    cells[randPos].children[0].innerHTML = "1";
};


function main() {
    let state = new State();
    drawKmap(state);
    labelCells(state);
    
    state.select.addEventListener("change", () => {
        state.setN(parseInt(state.select.value));
        // clearSolution(state.solbox);
        drawKmap(state);
        labelCells(state);
    });
    document.getElementById("randBtn").addEventListener("click", () => {
        randomizeKmap(state);
        let vals = Array.from(state.getCells()).map((c) => c.children[0].innerHTML);
        let input = getKmapInput(vals, state); 
        // use getSolution() to get the solution
        getSolution(input).then((sol) => {
            globalSolution = sol;
            console.log(sol);
        });
    });
}

main();