import {
    getSolution,
    showSolution,
    clearSolution,
    drawKmap,
    getKmapInput,
    labelCells,
    kmapPattern,
    clearInput
} from "./utils.js";

import { State } from "./state.js";

const VALUES = ["&nbsp;", "1", "X"];
const LENGTH = 3;

let minsInput = document.getElementById("minterms");
let dcsInput = document.getElementById("dontcares");

let state;

function nextValue(val) {
    return VALUES[(VALUES.indexOf(val) + 1) % LENGTH];;
}

function activateCells(state) {
    for (let c of state.getCells())
        c.addEventListener("click", () => {
            c.children[0].innerHTML = nextValue(c.children[0].innerHTML);
            fillFields();
            solve();
        });
}

function getFieldsInput(n) {

    // TODO: generalize this in a function
    let mins = minsInput.value.split(',')
        .map((str) => str.trim())
        .filter(str => str !== "")
        .map((v) => parseInt(v));

    let dcs = dcsInput.value.split(',')
        .map((str) => str.trim())
        .filter(str => str !== "")
        .map((v) => parseInt(v));

    return {mins, dcs, n};
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

    // console.log(input)

    if (!isValidInput(input))
        clearSolution(state.solbox);
    else
        getSolution(input).then((sol) => showSolution(sol, state.solbox));
}

// handles the input from the text fields
function handleFieldsInput() {
    let input = getFieldsInput(state.n);

    if (!isValidInput(input)) clearSolution(state.solbox);
    else getSolution(input).then((sol) => showSolution(sol, state.solbox));
}

// filles the input fields with the values from the kmap
function fillFields() {
    let cells = state.getCells();
    let pattern = kmapPattern(state.nRows, state.nCols);

    let mins = [];
    let dcs = [];

    let i = 0;
    for (let cell of cells) {
        if (cell.children[0].innerHTML === '1')
            mins.push(pattern[i]);
        else if (cell.children[0].innerHTML === 'X')
            dcs.push(pattern[i]);
        i++;
    }

    // sort the minterms and dontcares before they fill the fields (useless ?)
    mins.sort((a, b) => a - b);
    dcs.sort((a, b) => a - b);

    document.getElementById('minterms').value = mins.join(', ');
    document.getElementById('dontcares').value = dcs.join(', ');

}

// filles the kmap with the values from the input fields
function fillKmap() {
    let input = getFieldsInput(state.n);

    let cells = state.getCells();
    let pattern = kmapPattern(state.nRows, state.nCols);

    let i = 0;
    for (let cell of cells) {
        if (input.mins.includes(pattern[i]))
            cell.children[0].innerHTML = '1';
        else if (input.dcs.includes(pattern[i]))
            cell.children[0].innerHTML = 'X';
        else
            cell.children[0].innerHTML = '&nbsp;';
        i++;
    }
}

function resetKmap() {
    // clear the cells
    for (let c of state.getCells()) {
        c.children[0].innerHTML = "&nbsp;";
    }

    clearSolution(state.solbox);

    minsInput.value = '';
    dcsInput.value = '';
}

function activateCell(c) {
    c.addEventListener('click', () => {
        c.children[0].innerHTML = nextValue(c.children[0].innerHTML);
        fillFields();
        solve();
    })
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
        clearInput(minsInput, dcsInput);
        labelCells(state);
        activateCells(state);
        // fillKmap(); No, we want to clear the kmap
        // handleFieldsInput(state.n);
    });

    // set up fields (maybe I can combine them into one event listener)
    minsInput.addEventListener('input', () => {
        clearSolution(state.solbox);
        handleFieldsInput(state.n);
        fillKmap();

    });
    dcsInput.addEventListener('input', () => {
        clearSolution(state.solbox);
        handleFieldsInput(state.n);
        fillKmap();
    });

    // setup resetBtn
    let resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener("click", () => resetKmap(state.getCells()));
}

main();
