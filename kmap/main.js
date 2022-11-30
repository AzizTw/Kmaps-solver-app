const k = require("./kamp");

let n = 3;
let mins_dcs = new Set([1, 2, 3].map((e) => k.to_binary(e, n)))
let res = k.get_pis(mins_dcs, n);

if (res)
    console.log(Array.from(res).map((e) => k.translate_implicant(e)))
// console.log(k.get_all_min_sop_forms())

// console.log(Array.from(k.get_pis()).map((x) => k.translate_implicant(x)))
