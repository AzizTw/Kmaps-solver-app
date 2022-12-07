import {
    getSolution,
    showSolution,
    clearSolution,
    drawKmap,
    getKmapInput,
    labelCells,
} from "./utils.js";

import { State } from "./state.js";

const VALUES = ["&nbsp;", "1", "X"];
const LENGTH = 3;

let state;

function nextValue(val) {
    return VALUES[(VALUES.indexOf(val) + 1) % LENGTH];
}

function activateCells(state) {
    for (let c of state.getCells())
        c.addEventListener("click", () => {
            c.children[0].innerHTML = nextValue(c.children[0].innerHTML);
            solve();
        });
}

// check if the input is valid. A valid input is input that contains at least
// one minterm
function isValidInput(input) {
    return input.mins.length !== 0;
}

function solve() {
    // cells ia nodelist of divs
    let vals = Array.from(state.getCells()).map((c) => c.children[0].innerHTML);
    let input = getKmapInput(vals, state);

    if (!isValidInput(input)) clearSolution(state.solbox);
    else getSolution(input).then((sol) => showSolution(sol, state.solbox));
}

// Given the num_vars in a kmap, it returns the appropriate number of rows and
// columns
function kmapDim(num_vars) {
    let rows = 2 ** Math.floor(num_vars / 2);
    let columns = 2 ** Math.floor((num_vars + 1) / 2);

    return { rows, columns };
}

function resetKmap() {
    // clear the cells
    for (let c of state.getCells()) {
        c.children[0].innerHTML = "&nbsp;";
    }

    clearSolution(state.solbox);
}

function main() {
    state = new State();

    // activate cells and label them
    activateCells(state);
    labelCells(state);

    // set up select
    state.select.addEventListener("change", () => {
        state.setN(parseInt(state.select.value));
        clearSolution(state.solbox);
        drawKmap(state);
        labelCells(state);
        activateCells(state);
    });

    // setup resetBtn
    let resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener("click", () => resetKmap(state.getCells()));
}

main();
