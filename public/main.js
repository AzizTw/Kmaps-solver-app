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

function showSolution(sol) {
    let solbox = document.getElementById('solutionBox');
    solbox.innerHTML = "";
    let ul = document.createElement("ul");
    solbox.appendChild(ul);

    let li;
    li = document.createElement("li")
    li.textContent = "EPIs: ";
    if (sol.epis.length !== 0)
        li.textContent += sol.epis.join(", ");
    else
        li.textContent += "There are no essential prime implicants";

    ul.appendChild(li)

    li = document.createElement("li")
    li.innerHTML = "PIs: &nbsp;" + sol.pis.join(", ");
    ul.appendChild(li)

    li = document.createElement("li")
    li.textContent = sol.sops; // TODO: join this double array somehow
    ul.appendChild(li)

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
