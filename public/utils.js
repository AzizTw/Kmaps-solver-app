export async function getSolution(input) {
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
export function createList(content, className) {
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

export function showSolution(sol, solbox) {
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


export function clearSolution(solbox) {
    // clear the solution box, idk if this is the best way to do it
    solbox.innerHTML = " ";
    solbox.style.display = "none";
}
