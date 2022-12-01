const k = require("./kamp");

let n = 3;
let mins = new Set([1, 2, 3, 4, 5, 6, 7].map((e) => k.to_binary(e, n)))
let pis = k.get_pis(mins, n);
let cov = k.get_cov_dicts(pis, mins);
let epis = k.get_epis(cov.min_to_imps, pis)
// let sop = k.get_all_min_sop_forms(mins, cov.min_to_imps, epis)

// pis  = Array.from(pis).map((e) => k.translate_implicant(e, n));
// epis = Array.from(epis).map((e) => k.translate_implicant(e, n))
// console.log(pis)
// console.log(epis)
