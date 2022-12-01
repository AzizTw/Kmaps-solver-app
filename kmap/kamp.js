// javascript sets don't have a built in union method
// Use this function instead
function union(...sets) {
  return new Set([].concat(...sets.map(set => [...set])));
}

// count number of times character c occurs in string s
function count(s, c) {
    let count = 0;
    for (let i = 0; i < s.length; i++)
        if (s[i] === c)
            count++

    return count;
}

// javascript does not support zip either
// If a.length > b.length then we'll have [e, undefined]
// If a.length < b.length then we'll ignore all b[i] elements where i > a.length
function zip(a, b) {
    let z = [];
    for (let i = 0; i < a.length; i++)
        z.push([a[i], b[i]]);

    return z;
}

// check two sets are equal
function set_eq(a, b) {
    return a.size === b.size && [...a].every((x) => b.has(x));
}

function getPermutations(array, size) {

    function p(t, i) {
        if (t.length === size) {
            result.push(t);
            return;
        }
        if (i + 1 > array.length) {
            return;
        }
        p(t.concat(array[i]), i + 1);
        p(t, i + 1);
    }
    var result = [];
    p([], 0);
    return result;
}

// classes were a mistake
function to_binary(num, n) {
    let bin = num.toString(2);
    let diff = n - bin.length
    if (diff != 0)
        bin = "0".repeat(diff) + bin; // 0 extension to the left
    return bin;
}

function dffer_by_one_bit(m1, m2) {
    let diff = 0;
    let res = "";
    let z = zip(m1, m2);

    let b1; // bit1
    let b2; // bit2
    for (let i = 0; i < z.length; i++) {
        b1 = z[i][0];
        b2 = z[i][1];
        if (b1 !== b2) {
            diff++;
            res += "-";
        }
        else {
            res += b1;
        }
    }

    if (diff === 1)
        return res;
    else
        return false;
}

function translate_implicant(imp) {
    if (count(imp, "-") === imp.length)
        return "1";
    let res = "";

    // workaround for the lack of ord() in js
    const A = 65;

    let bit;
    for (let i = 0; i < imp.length; i++) {
        bit = imp[i];
        if (bit === "0")
            res += String.fromCharCode(A+i) + "'";
        else if (bit === "1")
            res += String.fromCharCode(A+i);
    }

    return res;
}

function count_literals(sop) {
    for (let i = 0; i < sop.length; i++) {
        let imp = sop[i];
        sum += (imp - count(imp, "-"));
    }
    return sum;
}

function is_covered(min, imp) {
    let iscov = true;
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

    // we don't have dicts in python, so we're using objects
function get_cov_dicts(pis, mins) {
    let imp_to_mins = {};
    pis.forEach((pi) => imp_to_mins[pi] = new Set());

    let min_to_imps = {};
    mins.forEach((m) => min_to_imps[m] = new Set())

    mins.forEach((min) => {
        pis.forEach((imp) => {
            if (is_covered(min, imp)) {
                imp_to_mins[imp].add(min);
                min_to_imps[min].add(imp);
            }
        })
    })

    // for (let i = 0; i < mins; i++) {
    //     min = this.mins[i];
    //     for (let j = 0; j < pis; j++) {
    //         imp = this.pis[j];
    //         if (is_covered(min, imp)) {
    //             imp_to_mins[imp].add(min);
    //             min_to_imps[min].add(imp)
    //         }
    //     }
    // }
    // console.log(min_to_imps)
    let cov = {imp_to_mins, min_to_imps};
    return cov;
}

function get_pis(mins_dcs, n) {
    let pis = new Set();
    let imps_all = [];
    imps_all.push(mins_dcs);

    for (let i = 1; i < n+1; i++) {
        imps_all.push(new Set());
    }

    let size;
    let used_once;
    let differ;
    for (let i = 0; i < imps_all.length; i++) {
        size = Array.from(imps_all[i]);
        for (let imp1 of size) {
            used_once = false;
            for (let imp2 of size) {
                differ = dffer_by_one_bit(imp1, imp2);
                if (differ !== false) {
                    used_once = true;
                    imps_all[i+1].add(differ);
                }
            }
            if (!used_once) {
                pis.add(imp1);
            }
        }
    }
        return pis;
}

function get_epis(min_to_imps) {
    let epis = new Set();

    let pis;
    for (let min in min_to_imps) {
        pis = min_to_imps[min];
        if (pis.size === 1)
            epis = union(epis, pis);
    }

    return epis;
}

function is_covering_all_minterms(mins, possible_min_sop) {
    let cov = new Set();
    for(let imp of possible_min_sop) {
        for (let min of mins) {
            if (is_covered(min, imp)) {
                cov.add(min);
            }
        }
    }
    return set_eq(cov, mins);
}

function get_all_min_sop_forms(mins, imp_to_mins, epis) {
    // let mins_notcov = new Set(Array.from(mins).map((min) => min)) // copy
    // console.log(epis)
    // let i;
    // for (let epi of epis) {
    //     for (let min of imp_to_mins[epi]) {
    //         if (mins_notcov.includes(min)) {
    //             i = mins_notcov.indexOf(min); // js is stupid
    //             mins_notcov.splice(i, 1);
    //         }
    //     }
    // }

    // if (mins_notcov.length === 0) {
    //     return Array.from(epis)
    // }

    // let uimp = new Set();
    // for (let min of mins_notcov) {
    //     for (pi of this.min_to_imps[min]) {
    //         uimp.add(pi);
    //     }
    // }

    // let combos = [];
    // let perms;
    // for (let i = 1; i < mins_notcov+1; i++) {
    //     perms = getPermutations(uimp, i);
    //     combos.push(... perms);
    // }

    //     let sops = [];
    //     let len = 0;
    //     let s;
    //     for (c of combos) {
    //         s = Array.from(epi);
    //         s.push(... c);
    //         if (is_covering_all_minterms(s)) {
    //             if (len === 0) {
    //                 len = count_literals(s);
    //                 sops.push(s);
    //             }
    //             else if(count_literals(s) === len)
    //                 sops.append(s);
    //         }
    //     }
    //     return sops;
    }

module.exports = {
    get_pis,
    get_epis,
    get_all_min_sop_forms,
    translate_implicant,
    to_binary,
    get_cov_dicts
};
