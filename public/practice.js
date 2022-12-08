import { State } from "./state.js";
import { drawKmap, labelCells, getKmapInput, getSolution, VALUES, LENGTH } from "./utils.js";

let globalSolution;

let nEPIsInput = document.getElementById("nEPIs");
let nPIsInput = document.getElementById("nPIs");
let sopInput = document.getElementById("SOP");

console.log("practice.js loaded");


function randomizeKmap(state) {

    let cells = state.getCells();

    for (let cell of cells) {
    // Replace the value of each cell with a random value from VALUES
    cell.children[0].innerHTML = VALUES[Math.floor(Math.random() * LENGTH)];
    }

    // Add "1" in a random position, so that the kmap is guaranteed to be valid
    let randPos = Math.floor(Math.random() * cells.length);
    cells[randPos].children[0].innerHTML = "1";
};

// solves the kmap and stores the solution in globalSolution
function storeSolution(state) {
    let vals = Array.from(state.getCells()).map((c) => c.children[0].innerHTML);
    let input = getKmapInput(vals, state); 
    getSolution(input).then((sol) => {
        globalSolution = sol;
        console.log(sol);
    });
}

function checkSOP(answerSOP){
    for (let correctSOP of globalSolution.sops)
        if (answerSOP.every((minterm) => correctSOP.includes(minterm)))
            return true;
    return false;
}

function showAnswerResult(answer, id){
    let result = document.getElementById(id);
    if (answer){
        result.innerHTML = "&#10004;"
        result.classList.add("check");
        result.classList.remove("cross"); // remove cross class if it exists
    }
    else{
        result.innerHTML = "&#10008;"
        result.classList.add("cross");
        result.classList.remove("check"); // remove check class if it exists
    }    
}

function checkSolution(){
    let nEPIs = parseInt(nEPIsInput.value);
    let nPIs = parseInt(nPIsInput.value);
    let sop = sopInput.value.toUpperCase();
    //remove all spaces from sop
    sop = sop.replace(/\s/g, '');
    //split sop into an array of minterms
    sop = sop.split("+");

    let nEPIsCorrect = globalSolution.epis.length === nEPIs;
    let nPIsCorrect = globalSolution.pis.length === nPIs;
    let sopCorrect = checkSOP(sop);

    showAnswerResult(nEPIsCorrect, "nPIsCheck");
    showAnswerResult(nPIsCorrect, "nEPIsCheck");
    showAnswerResult(sopCorrect, "SOPCheck");
}

function main() {
    let state = new State();
    drawKmap(state);
    labelCells(state);
    
    state.select.addEventListener("change", () => {
        state.setN(parseInt(state.select.value));
        // clearSolution(state.solbox);
        drawKmap(state);
        labelCells(state);
    });
    document.getElementById("randBtn").addEventListener("click", () => {
        randomizeKmap(state);
        storeSolution(state);
    });

    document.getElementById("checkBtn").addEventListener("click", () => {
        checkSolution();
    });
}

main();