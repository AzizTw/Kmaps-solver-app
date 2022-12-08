import { State } from "./state.js";
import { drawKmap, labelCells } from "./utils.js";

console.log("practice.js loaded");


function randomizeKmap(state) {
    let cells = state.getCells();
    let n = state.n;
    let nRows = state.nRows;
    let nCols = state.nCols;
    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nCols; j++) {
            let cell = cells[i * nCols + j];
            let val = Math.floor(Math.random() * 3);
            let newVal;
            if (val === 0) newVal = "&nbsp;";
            else if (val === 1) newVal = "1";
            else newVal = "X";
            cell.children[0].innerHTML = newVal;
        }
    }
}


function main() {
    let state = new State();
    drawKmap(state);
    labelCells(state);
    
    state.select.addEventListener("change", () => {
        state.setN(parseInt(state.select.value));
        // clearSolution(state.solbox);
        drawKmap(state);
        labelCells(state);
        randomizeKmap(state);
    });
}

main();