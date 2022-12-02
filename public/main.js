const VALUES = ['&nbsp;', '1', 'X'];
const LENGTH = 3;

function nextValue(val) {
    return VALUES[(VALUES.indexOf(val)+1) % LENGTH]
}

function toGray(n) {
    return n ^ (n >> 1);
}

/*
Given the number of variables, it returns an array of
cells in the kmap ordered by gray code.
kmapPattern(3) = [0, 1, 3, 2,
                  4, 5, 7, 6]
 */
function kmapPattern(num_vars) {

    const ROWS_COUNT = 2 ** Math.floor(num_vars / 2);
    const COLUMNS_COUNT = 2 ** Math.floor((num_vars + 1) / 2);

    // The rows in the kmap gray-coded, ex: [00, 01, 11, 10]
    let rows = [];
    for (let i = 0; i < ROWS_COUNT; i++) {
        rows.push(toGray(i));
    }

    // The columns in the kmap gray-coded, ex: [00, 01, 11, 10]
    let cols = [];
    for (let j = 0; j < COLUMNS_COUNT; j++) {
        cols.push(toGray(j));
    }

    let kmap = [];
    for (let row of rows) {
        for (let col of cols) {
            // converts the gray code to binary string then pads it with 0s.
            let rowPart = row.toString(2).padStart(Math.log2(ROWS_COUNT),'0');
            let colPart = col.toString(2).padStart(Math.log2(COLUMNS_COUNT),'0');

            // concatenates the two parts, resulting in a cell in the kmap
            let cell = rowPart + colPart;
            // push the cell to the kmap after converting it to integer
            kmap.push(parseInt(cell, 2));
        }
    }

    return kmap;
}

// Given an array of values, it returns an object containing:
// - number of variables
// - minterms
// - dontcares
function getKmapInput(arr) {
    let mins = [];
    let dcs = []; // dont_cares
    let n = 4; // TODO: hardcoded to 4 for now

    let pattern = kmapPattern(n);

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

function createList(title, content) {
    let ul = document.createElement("ul");
    let li;
    li = document.createElement("li");
    li.textContent = title;
    ul.appendChild(li);

    for (let c of content) {
        li = document.createElement("li");
        li.textContent = c;
        ul.appendChild(li);
    }

    return ul;
}

function showSolution(sol) {
    let solbox = document.getElementById("solutionBox");
    solbox.innerHTML = " ";

    if (sol.epis !== 0)
        solbox.appendChild(createList("EPIs: ", sol.epis));
    // else TODO: should we really do nothing?

    solbox.appendChild(createList("PIs: ", sol.pis));

    // make sops look human readable
    for (let i = 0; i < sol.sops.length; i++)
        sol.sops[i] = sol.sops[i].join(" + ");

    solbox.appendChild(createList("SOPs: ", sol.sops));

    solbox.style.display = "block";
}

function solve(cells) { // cells ia nodelist of divs
    let vals = Array.from(cells).map((c) => c.innerHTML);
    let input = getKmapInput(vals);
    getSolution(input).then((sol) => showSolution(sol));
}

function main() {
    let cells = document.querySelectorAll(".kmap > .cell");
    for (let c of cells)
        c.addEventListener('click', () => c.innerHTML = nextValue(c.innerHTML));

    let solveBtn = document.getElementById("solveBtn");
    // solveBtn.addEventListener('click', parseKmap(Array.from(cells).map((c) => c.innerHTML)));
    solveBtn.addEventListener('click', () => solve(cells));

}

main();
