import { getSolution, showSolution, clearSolution, } from "./utils.js";

const VALUES = ['&nbsp;', '1', 'X'];
const LENGTH = 3;
let state;

class State {
    constructor() {
        this.kmap = document.querySelector('.kmap');
        this.select = document.getElementById('kmapSize')
        this.solbox = document.getElementById("solutionBox");

        this.minsInput = document.getElementById("minterms");
        this.dcsInput = document.getElementById("dontcares");
        this.setN(parseInt(this.select.value));
    }

    setN(n) {
        this.n = n;
        let dim = kmapDim(this.n);
        this.nRows = dim.rows;
        this.nCols = dim.columns;
    }

    getCells() {
        return this.kmap.children;
    }
}

function labelCells(n) {
    let kmap = document.querySelector('.kmap');
    let cells = kmap.children;

    let pattern = kmapPattern(state.nRows, state.nCols);

    let i = 0;
    for (let cell of cells) {
        cell.children[1].innerHTML = pattern[i];
        i++;
    }

    if (n >= 5)
        document.querySelectorAll('.cell-label').forEach((label) => label.style.fontSize = "40%")
}

function nextValue(val) {
    return VALUES[(VALUES.indexOf(val)+1) % LENGTH];
}

function toGray(n) {
    return n ^ (n >> 1);
}

// Given the num_vars in a kmap, it returns the appropriate number of rows and
// columns
function kmapDim(num_vars) {
    let rows = 2 ** Math.floor(num_vars / 2);
    let columns = 2 ** Math.floor((num_vars + 1) / 2);

    return {rows, columns};
}

/*
Given the number of rows and columns, it returns an array of
cells in the kmap ordered by gray code.
kmapPattern(3) = [0, 1, 3, 2,
                  4, 5, 7, 6]
 */
function kmapPattern(rows_count, columns_count) {

    // The rows in the kmap gray-coded, ex: [00, 01, 11, 10]
    let rows = [];
    for (let i = 0; i < rows_count; i++) {
        rows.push(toGray(i));
    }

    // The columns in the kmap gray-coded, ex: [00, 01, 11, 10]
    let cols = [];
    for (let j = 0; j < columns_count; j++) {
        cols.push(toGray(j));
    }

    let pattern = [];
    for (let row of rows) {
        for (let col of cols) {
            // converts the gray code to binary string then pads it with 0s.
            let rowPart = row.toString(2).padStart(Math.log2(rows_count),'0');
            let colPart = col.toString(2).padStart(Math.log2(columns_count),'0');

            // concatenates the two parts, resulting in a cell in the kmap
            let cell = rowPart + colPart;
            // push the cell to the kmap after converting it to integer
            pattern.push(parseInt(cell, 2));
        }
    }

    return pattern;
}

// Given an array of values, it returns an object containing:
// - number of variables
// - minterms
// - dontcares
function getKmapInput(arr, n) {
    let mins = [];
    let dcs = []; // dont_cares

    let pattern = kmapPattern(state.nRows, state.nCols);

    let v;
    for (let i = 0; i < arr.length; i++) {
        v = arr[i];
        if (v === '1')
            mins.push(pattern[i]);

        else if (v === 'X')
            dcs.push(pattern[i]);
    }

    return {mins, dcs, n};
}

function getFieldsInput(n) {

    let mins = document.getElementById('minterms').value.split(',').map((v) => parseInt(v));
    let dcs = document.getElementById('dontcares').value.split(',').map((v) => parseInt(v));

    // check if dcs is nan
    if (isNaN(dcs[0]))
        dcs = [];
    return {mins, dcs, n};
}

// check if the input is valid. A valid input is input that contains at least
// one minterm
function isValidInput(input) {
    return input.mins.length !== 0
}

function solve() { // cells ia nodelist of divs
    let vals = Array.from(state.getCells()).map((c) => c.children[0].innerHTML);
    let input = getKmapInput(vals, state.n);

    // console.log(input)

    if (!isValidInput(input))
        clearSolution(state.solbox);
    else
        getSolution(input).then((sol) => showSolution(sol, state.solbox));
}

// handles the input from the text fields
function handleFieldsInput() {
    let input = getFieldsInput(state.n);


    if (!isValidInput(input))
        clearSolution(state.solbox);
    else
        getSolution(input).then((sol) => showSolution(sol, state.solbox));
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
    for (let c of state.getCells()){
        c.children[0].innerHTML = '&nbsp;';
    }


    clearSolution(state.solbox);

    // clear the input fields
    state.minsInput.value = '';
    state.dcsInput.value = '';
}

function activateCell(c) {
    c.addEventListener('click', () => {
        c.children[0].innerHTML = nextValue(c.children[0].innerHTML);
        fillFields();
        solve();
    })
}

function createCell(value) {
    let cell = document.createElement("div");
    let label = document.createElement("span");
    let valueSpan = document.createElement("span");
    cell.className = "cell";
    label.className = "cell-label";
    valueSpan.className = "cell-value";
    valueSpan.innerHTML = value;
    cell.appendChild(valueSpan);
    cell.appendChild(label);
    activateCell(cell);

    return cell;
}

function resizeKmap(n) { // n is the number of variables
    let kmap = state.kmap;
    kmap.innerHTML = ""; // empty out kmap

    let nCells = 2**n;
    for (let i = 0; i < nCells; i++){
        kmap.appendChild(createCell('&nbsp;'));
    }


    kmap.style.gridTemplateColumns = `repeat(${state.nCols}, 1fr)`;
}

function main() {
    state = new State();

    // activate cells
    for (let c of state.getCells())
        activateCell(c);

    labelCells(state.n);

    // set up select
    state.select.addEventListener('change', () => {
        state.setN(parseInt(state.select.value));
        clearSolution(state.solbox);
        resizeKmap(state.n);
        labelCells(state.n);
        fillKmap();
        handleFieldsInput(state.n);
    });

    // set up fields (maybe I can combine them into one event listener)
    state.minsInput.addEventListener('input', () => {
        clearSolution(state.solbox);
        handleFieldsInput(state.n);
        fillKmap();

    });
    state.dcsInput.addEventListener('input', () => {
        clearSolution(state.solbox);
        handleFieldsInput(state.n);
        fillKmap();
    });

    // setup resetBtn
    let resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener('click', () => resetKmap(state.getCells()));

}

main();
