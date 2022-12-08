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
export function createList(content, className) {
    let ul = document.createElement("ul");
    if (className) ul.className = className;

    for (let c of content) {
        let li = document.createElement("li");
        li.textContent = c;
        ul.appendChild(li);
    }

    return ul;
}

export function showSolution(sol, solbox) {
    solbox.innerHTML = " "; // clear

    // A <li> for each sub solution
    let liEpis = document.createElement("li");
    let liPis = document.createElement("li");
    let liSops = document.createElement("li");
    liEpis.innerHTML = "<div class='legend'>EPIs</div>";
    liPis.innerHTML = "<div class='legend'>PIs &nbsp;</div>";
    liSops.innerHTML = "<div class='legend'>Sops</div>";

    if (sol.epis.length !== 0) liEpis.appendChild(createList(sol.epis, "sub"));

    liPis.appendChild(createList(sol.pis, "sub"));

    if (sol.sops[0].length !== 0) {
        // if we have one sop at least
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
            .forEach((label) => (label.style.fontSize = "40%"));
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
