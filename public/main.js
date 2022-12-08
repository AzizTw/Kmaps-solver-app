import {
    getSolution,
    showSolution,
    clearSolution,
    drawKmap,
    getKmapInput,
    labelCells,
    kmapPattern,
    clearInput,
    VALUES,
    LENGTH,
} from "./utils.js";

import { State } from "./state.js";



let minsInput = document.getElementById("minterms");
let dcsInput = document.getElementById("dontcares");

let state;

function nextValue(val) {
    return VALUES[(VALUES.indexOf(val) + 1) % LENGTH];;
}

// function activateCell(c) {
//     c.addEventListener('click', () => {
//         c.children[0].innerHTML = nextValue(c.children[0].innerHTML);
//         fillFields();
//         solve();
//     })
// }

function activateCells(state) {
    for (let c of state.getCells())
        c.addEventListener("click", () => {
            c.children[0].innerHTML = nextValue(c.children[0].innerHTML);
            fillFields();
            solve();
        });
}

// returns an array of numbers from a list of a comma seperated strings
// If the string is invalid, returns null. If the string is empty
// returns an emptty array
function parseArray(str) {
    str = str.trim(); // remove leading and trailing whitespace

    if (str === "")
        return [];

    let reg = /^[0-9]+\s*(,\s*[0-9]+)*,?$/; // TODO: explain this
    if (!reg.test(str))
        return null;

    str = str.replace(/,$/, ""); // remove trailing comma, if any
    let arr = str.split(",");
    arr = arr.map((e) => parseInt(e.trim())) // fix cases like 0,   1,   2

    return arr;
}

// Returns a copy of the array that only has unique values.
function uniquize(arr) {
    return [... new Set(arr)];
}

// returns an input object if the user input is input. If input is not valid it
// will return null.
function getFieldsInput(n) {
    let mins;
    let dcs;

    // attempt to get get arrays
    if ((mins = parseArray(minsInput.value)) === null)
        return null;

    if ((dcs = parseArray(dcsInput.value)) === null)
        return null;

    // remove duplciates
    mins = uniquize(mins);
    dcs = uniquize(dcs);

    // check input doesn't exceed limit
    let limit = 2**n - 1;
    if (Math.max(...mins) > limit || Math.max(...dcs) > limit)
        return null;

    // check if a term is repeated in mins and dcs
    let intersection = mins.filter((min) => dcs.includes(min));
    if (intersection.length !== 0)
        return null;

    return {n, mins, dcs};
}

function solve() {
    // cells ia nodelist of divs
    let vals = Array.from(state.getCells()).map((c) => c.children[0].innerHTML);
    let input = getKmapInput(vals, state);

    // console.log(input)

    if (input.mins.length !== 0) // valid kmap
        clearSolution(state.solbox);
    else
        getSolution(input).then((sol) => showSolution(sol, state.solbox));
}

// handles the input from the text fields
function handleFieldsInput() {
    let input = getFieldsInput(state.n);

    if (input === null)
        console.log("bad input bro");

    else if (input.mins.length === 0)
        clearSolution(state.solbox);
    else
        getSolution(input).then((sol) => showSolution(sol, state.solbox));

    return input;
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
function fillKmap(input) {
    if (input === null)
        return;

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
        let input = handleFieldsInput(state.n);
        fillKmap(input);

    });
    dcsInput.addEventListener('input', () => {
        let input = handleFieldsInput(state.n);
        fillKmap(input);
    });

    // setup resetBtn
    let resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener("click", () => resetKmap(state.getCells()));
}

main();
