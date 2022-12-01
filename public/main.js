const VALUES = ['&nbsp;', '1', 'X'];
const LENGTH = 3;

function nextValue(cell) { // here cell is a div
    let val = cell.innerHTML;
    cell.innerHTML = VALUES[(VALUES.indexOf(val)+1) % LENGTH]
}

function main() {
    let cells = document.querySelectorAll(".kmap > .cell");

    for (let c of cells)
        c.addEventListener('click', () => nextValue(c));
}

main();
