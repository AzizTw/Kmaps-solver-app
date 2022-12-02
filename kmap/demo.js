const k = require("./kamp");

let n = 4;
let mins = [0b0000, 0b0111, 0b1101, 0b1000];
let dcs = [0b0100, 0b0101, 0b0010];
let res = k.solve(n, mins, dcs);
console.log(res);

// let n = 4;
// let mins = new Set([0, 1, 2, 3, 4].map((e) => k.to_binary(e, n)))
// let dcs = new Set([8, 9, 10, 11].map((e) => k.to_binary(e, n)));
// let mins_dcs = k.union(mins, dcs);
// let pis = k.get_pis(mins_dcs, n);
// let cov = k.get_cov_dicts(pis, mins);
// let epis = k.get_epis(cov.min_to_imps, pis)
// let sops = k.get_all_min_sop_forms(mins, cov.imp_to_mins, cov.min_to_imps, epis)

// pis  = Array.from(pis).map((e) => k.translate_implicant(e, n));
// epis = Array.from(epis).map((e) => k.translate_implicant(e, n))

// for (let i = 0; i < sops.length; i++) {
//     sops[i] = sops[i].map((e) => k.translate_implicant(e, n));
// }

// console.log(epis)
// console.log(pis)
// console.log(sops)
