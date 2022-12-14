export const VALUES = ["&nbsp;", "1", "X"];
export const LENGTH = 3;

export async function getSolution(input) {
    let url = "/"; // TODO: might need to change for practice mode
    let res = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    return await res.json();
}

// returns a new <ul> element with class name of className (optional) populated with <li>
// items containing each element of the content array
export function createList(content, className, callback) {
    let ul = document.createElement("ul");
    if (className) ul.className = className;

    for (let c of content) {
        let li = document.createElement("li");
        li.className = "subCell";
        li.textContent = c;
        if (callback)
            callback(li);
        ul.appendChild(li);
    }

    return ul;
}

export function showSolution(sol, solbox) {
    solbox.innerHTML = " "; // clear
    const addCopyOnClick = (li) => li.addEventListener('click', async () => {
        await navigator.clipboard.writeText(li.textContent);
        let tooltip = document.getElementById("copy-tooltip");
        tooltip.style.display = "inline";
        setTimeout(() => tooltip.style.display = "none", 500);
    });

    // A <li> for each sub solution
    let liEpis = document.createElement("li");
    let liPis = document.createElement("li");
    let liSops = document.createElement("li");
    liPis.innerHTML = "<div class='legend'><abbr title='Prime implicants'>PIs</abbr> &nbsp;</div>";
    liSops.innerHTML = "<div class='legend'><abbr title='Sum of products'>Sops</abbr></div>";

    if (sol.epis.length !== 0){
        liEpis.innerHTML = "<div class='legend'><abbr title='Essential prime implicants'>EPIs</abbr></div>";
        liEpis.appendChild(createList(sol.epis, "sub", addCopyOnClick));
    }

    liPis.appendChild(createList(sol.pis, "sub", addCopyOnClick));

    console.log(sol.sops);
    // i will make a dummy sops variable that is a copy of sol.sops
    // so that we can modify it without affecting sol.sops
    let sops = sol.sops.slice();
    if (sops[0].length !== 0) {
        // if we have one sop at least
        // make sops look human readable before appending
        for (let i = 0; i < sops.length; i++){
            sops[i] = sops[i].join(" + ");
        }

        liSops.appendChild(createList(sops, "sub", addCopyOnClick));
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

export function clearKmap(kmap) {
    kmap.innerHTML = ""; // empty out kmap
}

export function clearSolution(solbox) {
    // clear the solution box, idk if this is the best way to do it
    solbox.innerHTML = " ";
    solbox.style.display = "none";
}

export function clearInput(minsInput, dcsInput) {
    minsInput.value = "";
    dcsInput.value = "";
}

export function clearErrors() {
    document.getElementById("minsCross").innerHTML = "";
    document.getElementById("dcsCross").innerHTML = "";
    document.getElementById("intersection").innerHTML = "";
}

// Create an inactive cell, so it can be used for both modes.
// Later, we can activate the cells for calc mode.
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
    // activateCell(cell);
    return cell;
}

// Originally called resizeKmap
export function drawKmap(state) {
    // n is the number of variables
    let kmap = state.kmap;
    clearKmap(state.kmap)

    let nCells = 2 ** state.n;
    for (let i = 0; i < nCells; i++) {
        kmap.appendChild(createCell("&nbsp;"));
    }

    kmap.style.gridTemplateColumns = `repeat(${state.nCols}, 1fr)`;
}

export function labelCells(state) {
    let kmap = document.querySelector(".kmap");
    let cells = kmap.children;

    let pattern = kmapPattern(state.nRows, state.nCols);

    let i = 0;
    for (let cell of cells) {
        cell.children[1].innerHTML = pattern[i];
        i++;
    }

    if (state.n >= 5)
        document
            .querySelectorAll(".cell-label")
            .forEach((label) => (label.style.fontSize = "50%"));
}

// Given an array of values, it returns an object containing:
// - number of variables
// - minterms
// - dontcares
export function getKmapInput(arr, state) {
    let mins = [];
    let dcs = []; // dont_cares

    let pattern = kmapPattern(state.nRows, state.nCols);

    let v;
    for (let i = 0; i < arr.length; i++) {
        v = arr[i];
        if (v === "1") mins.push(pattern[i]);
        else if (v === "X") dcs.push(pattern[i]);
    }
    let n = state.n;
    return { mins, dcs, n };
}

function toGray(n) {
    return n ^ (n >> 1);
}

/*
Given the number of rows and columns, it returns an array of
cells in the kmap ordered by gray code.
kmapPattern(3) = [0, 1, 3, 2,
                  4, 5, 7, 6]
 */
export function kmapPattern(rows_count, columns_count) {
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
            let rowPart = row.toString(2).padStart(Math.log2(rows_count), "0");
            let colPart = col
                .toString(2)
                .padStart(Math.log2(columns_count), "0");

            // concatenates the two parts, resulting in a cell in the kmap
            let cell = rowPart + colPart;
            // push the cell to the kmap after converting it to integer
            pattern.push(parseInt(cell, 2));
        }
    }

    return pattern;
}

// filles the kmap with the values from the input fields
export function fillKmap(input, state) {
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

function detranslate(n, implicant) {
    if (implicant === "1") {
        return "-".repeat(n);
    }

    let negated = [];
    let not_negated = [];
    for (let i = 0; i < implicant.length; i++) {
        let literal = implicant[i];
        if (i + 1 < implicant.length && implicant[i+1] === '\'') {
            negated.push(literal);
        } else if (literal !== '\'') {
            not_negated.push(literal);
        }
    }

    let returned_implicant = "";
    for (let i = 0; i < n; i++) {
        let c = String.fromCharCode("A".charCodeAt(0) + i);
        if (not_negated.includes(c)) {
            returned_implicant += "1";
        } else if (negated.includes(c)) {
            returned_implicant += "0";
        } else {
            returned_implicant += "-";
        }
    }
    return returned_implicant;
}

function is_covered(min, imp) {
    let z = zip(min, imp);
    let imp_bit;
    let min_bit;

    for (let pair of z) {
        min_bit = pair[0];
        imp_bit = pair[1];
        if (imp_bit === "-")
            continue;
        else if (imp_bit !== min_bit) {
            return false;
        }
    }
    return true;
}

function zip(a, b) {
    let z = [];
    for (let i = 0; i < a.length; i++)
        z.push([a[i], b[i]]);

    return z;
}

// a function that takes an array of minterms and returns the minters that are covered by the implicant
export function are_covered(state, implicant) {
    let covered = [];
    let minterms = [];
    for (let i = 0; i < (state.nRows * state.nCols); i++) {
        // add minterms to the array as a binary string with lenght of n
        minterms.push(i.toString(2).padStart(state.n, "0"));
    }

    for (let imp of implicant.replace(/\s/g, '').split("+")){
        imp = detranslate(state.n, imp);
        for (let minterm of minterms) {
            if (is_covered(minterm, imp)) {
                covered.push(parseInt(minterm, 2));
            }
        }
    }

    return covered;
}

export function activateSubs(state){
    let subs = document.querySelectorAll(".subCell");

    subs.forEach((sub) => {
        sub.addEventListener("mouseover", () => {
            highlightMins(state, sub.textContent);
        });

        sub.addEventListener("mouseout", () => {
            unhighlightMins(state, sub.textContent);
        });
    });
}

function highlightMins(state, implicant){
    let cells = state.getCells();
    let pattern = kmapPattern(state.nRows, state.nCols);
    let mins = are_covered(state, implicant)

    mins.forEach((min) => {
        cells[pattern.indexOf(min)].classList.add("highlight");
    });
}

function unhighlightMins(state, implicant){
    let cells = state.getCells();
    let pattern = kmapPattern(state.nRows, state.nCols);
    let mins = are_covered(state, implicant)

    mins.forEach((min) => {
        cells[pattern.indexOf(min)].classList.remove("highlight");
    });
}
