const VALUES = ['&nbsp;', '1', 'X'];
const LENGTH = 3;
let state;

class State {
    constructor() {
        this.kmap = document.querySelector('.kmap');
        this.select = document.getElementById('kmapSize')
        this.solbox = document.getElementById("solutionBox");

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

function nextValue(val) {
    return VALUES[(VALUES.indexOf(val)+1) % LENGTH]
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

function getN() {
    let select = document.getElementById('kmapSize');
    return parseInt(select.value);
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

async function getSolution(input) {
    let url = "/" // TODO: might need to change for practice mode
    let res = await fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
    });

    return await res.json();
}

// returns a new <ul> element with class name of className (optional) populated with <li>
// items containing each element of the content array
function createList(content, className) {
    let ul = document.createElement("ul");
    if (className)
        ul.className = className;

    for (let c of content) {
        let li = document.createElement("li");
        li.textContent = c;
        ul.appendChild(li);
    }

    return ul;
}

function clearSolution() {
    // clear the solution box, idk if this is the best way to do it
    let solbox = state.solbox;
    solbox.innerHTML = " ";
    solbox.style.display = "none";
}

function showSolution(sol) {
    let solbox = state.solbox;
    solbox.innerHTML = " "; // clear

    // A <li> for each sub solution
    let liEpis = document.createElement("li");
    let liPis = document.createElement("li");
    let liSops = document.createElement("li");
    liEpis.innerHTML = "<div class='legend'>EPIs</div>";
    liPis.innerHTML = "<div class='legend'>PIs &nbsp;</div>";
    liSops.innerHTML = "<div class='legend'>Sops</div>";

    if (sol.epis.length !== 0)
        liEpis.appendChild(createList(sol.epis, "sub"));

    liPis.appendChild(createList(sol.pis, "sub"));

    if (sol.sops[0].length !== 0) { // if we have one sop at least
        // make sops look human readable before appending
        for (let i = 0; i < sol.sops.length; i++)
            sol.sops[i] = sol.sops[i].join(" + ");
        liSops.appendChild(createList(sol.sops, "sub"));
    }

    // main <ul>
    let ul = document.createElement("ul");
    ul.className = "main";
    ul.appendChild(liEpis);
    ul.appendChild(liPis);
    ul.appendChild(liSops);

    solbox.appendChild(ul);
    solbox.style.display = "inline-block";
}

// check if the input is valid. A valid input is input that contains at least
// one minterm
function isValidInput(input) {
    return input.mins.length !== 0
}

function solve() { // cells ia nodelist of divs

    let vals = Array.from(state.getCells()).map((c) => c.innerHTML);
    let input = getKmapInput(vals, state.n);

    if (!isValidInput(input))
        clearSolution();
    else
        getSolution(input).then((sol) => showSolution(sol));
}

function resetKmap() {
    // clear the cells
    for (let c of state.getCells())
        c.innerHTML = "&nbsp;";

    clearSolution();
}

function activateCell(c) {
    c.addEventListener('click', () => {
        c.innerHTML = nextValue(c.innerHTML);
        solve();
    })
}

function createCell(value) {
    let cell = document.createElement("div");
    cell.className = "cell";
    cell.innerHTML = value;
    activateCell(cell);
    return cell;
}

function resizeKmap(n) { // n is the number of variables
    let kmap = state.kmap;
    kmap.innerHTML = ""; // empty out kmap

    let nCells = 2**n;
    for (let i = 0; i < nCells; i++)
        kmap.appendChild(createCell('&nbsp;'));

    kmap.style.gridTemplateColumns = `repeat(${state.nCols}, 1fr)`;
}

function main() {
    state = new State();

    // activate cells
    for (let c of state.getCells())
        activateCell(c);

    // set up select
    state.select.addEventListener('change', () => {
        state.setN(parseInt(state.select.value));
        clearSolution();
        resizeKmap(state.n);
    });

    // setup resetBtn
    let resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener('click', () => resetKmap(state.getCells()));
}

main();
