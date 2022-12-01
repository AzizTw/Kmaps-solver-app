const k = require("./kamp");

let n = 4;
let mins = new Set([0, 1, 2, 3, 6, 7, 8, 9, 11, 13, 14, 15].map((e) => k.to_binary(e, n)))
let pis = k.get_pis(mins, n);
let cov = k.get_cov_dicts(pis, mins);
let epis = k.get_epis(cov.min_to_imps, pis)
let sops = k.get_all_min_sop_forms(mins, cov.imp_to_mins, cov.min_to_imps, epis)

// console.log(pis)
// console.log(epis)
// console.log(sops)

pis  = Array.from(pis).map((e) => k.translate_implicant(e, n));
epis = Array.from(epis).map((e) => k.translate_implicant(e, n))

for (let i = 0; i < sops.length; i++) {
    sops[i] = sops[i].map((e) => k.translate_implicant(e, n));
}

console.log(sops)
console.log(pis)
console.log(epis)
