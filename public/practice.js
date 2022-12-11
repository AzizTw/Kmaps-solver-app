import { State } from "./state.js";

import {
    drawKmap,
    labelCells,
    getKmapInput,
    getSolution,
    fillKmap,
    VALUES,
    LENGTH,
    showSolution,
    activateSubs,
    clearSolution,
} from "./utils.js";

let globalSolution;
let state;
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
    console.log(answerSOP);
    console.log(globalSolution.sops);
    if (answerSOP.length === 0)
        return false;

    for (let correctSOP of globalSolution.sops)
        if (correctSOP.every((term) => answerSOP.includes(term)))
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

function resetInputs(){
    nEPIsInput.value = "";
    nPIsInput.value = "";
    sopInput.value = "";
    document.getElementById("nPIsCheck").innerHTML = "";
    document.getElementById("nEPIsCheck").innerHTML = "";
    document.getElementById("SOPCheck").innerHTML = "";
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

    
    showAnswerResult(nPIsCorrect, "nPIsCheck");
    showAnswerResult(nEPIsCorrect, "nEPIsCheck");
    showAnswerResult(sopCorrect, "SOPCheck");
}

async function requestInput(id) {
    let url = "/practice";
    let res = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({id}),
    });

    return await res.json();
}

function disableInputs(){
    nEPIsInput.disabled = true;
    nPIsInput.disabled = true;
    sopInput.disabled = true;
    document.getElementById("checkBtn").disabled = true;
    document.getElementById("showSolBtn").disabled = true;
}

function enableInputs(){
    nEPIsInput.disabled = false;
    nPIsInput.disabled = false;
    sopInput.disabled = false;
    document.getElementById("checkBtn").disabled = false;
    document.getElementById("showSolBtn").disabled = false;
}


function main() {
    let state = new State();
    drawKmap(state);
    labelCells(state);

    
    disableInputs()

    state.select.addEventListener("change", () => {
        state.setN(parseInt(state.select.value));
        // clearSolution(state.solbox);
        drawKmap(state);
        labelCells(state);
    });
    document.getElementById("randBtn").addEventListener("click", () => {
        randomizeKmap(state);
        storeSolution(state);
        resetInputs();
        enableInputs();
        clearSolution(state.solbox);
    });

    document.getElementById("checkBtn").addEventListener("click", () => {
        checkSolution();
    });

    // <select> for picking a kmap from the database
    let kmapIdSel = document.getElementById("kmapId");
    kmapIdSel.addEventListener("change", () => {
        requestInput(parseInt(kmapIdSel.value)).then((res) => {
            state.select.value = res.input.n.toString();
            state.select.dispatchEvent(new Event('change')); // run a change event
            fillKmap(res.input, state);
            globalSolution = res.sol;
            enableInputs()
            clearSolution(state.solbox);
        });
    });

    let showSolBtn = document.getElementById("showSolBtn");

    showSolBtn.disabled = true;
    showSolBtn.addEventListener("click", () => {
        console.log(globalSolution);
        console.log(state.solbox);
        showSolution(globalSolution, state.solbox);
        activateSubs(state);
        //disable the input fields
        disableInputs();
    }
    );
}

main();
