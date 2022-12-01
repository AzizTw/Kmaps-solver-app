const VALUES = ['&nbsp;', '1', 'X'];
const LENGTH = 3;

function nextValue(val) {
    return VALUES[(VALUES.indexOf(val)+1) % LENGTH]
}

// Given an array of values, it returns an object containing:
// - number of variables
// - minterms
// - dontcares
function getKmapInput(arr) {
    let mins = [];
    let dcs = []; // dont_cares
    let n = 4; // TODO: hardcoded to 4 for now

    let v;
    for (let i = 0; i < arr.length; i++) {
        v = arr[i];
        if (v === '1')
            mins.push(i);
        else if (v === 'X')
            dcs.push(i);
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
