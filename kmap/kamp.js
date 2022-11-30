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

class Kmap {
    __setup() {
        this.mins_dcs = union(this.mins, this.dcs)
        this.pis = this.get_pis();
        let tmp = this.get_cov_dicts();
        this.imp_to_mins = tmp.imp_to_mins;
        this.min_to_imps = tmp.min_to_imps;
        this.epis = this.get_epis();
    }

     to_binary(num) {
         let binary_num = num.toString(2);
         let diff = this.num_of_vars - binary_num.length
         if (diff != 0)
             binary_num = "0".repeat(diff) + binary_num; // 0 extension to the left
         return binary_num;
     }

    dffer_by_one_bit(m1, m2) {
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

    translate_implicant(imp) {
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

    count_literals(sop) {
        for (let i = 0; i < sop.length; i++) {
            let imp = sop[i];
            sum += (imp - count(imp, "-"));
        }
        return sum;
    }

    is_covered(min, imp) {
        let iscov = true;
        let z = zip(min, imp);
        let imp_bit;
        let min_bit;
        for (let i = 0; i < z.lenght; i++) {
            min_bit = z[i][0];
            imp_bit = z[i][1];
            if (imp_bit === "-")
                continue;
            else if (imp_bit !== min_bit) {
                iscov = false;
                break;
            }
        }
        return iscov;
    }

    // we don't have dicts in python, so we're using objects
    get_cov_dicts() {
        let imp_to_mins = {};
        for (let i = 0; i < this.pis.length; i++)
            imp_to_mins[this.pis[i]] = new Set();

        let min_to_imps = {};
        for (let i = 0; i < this.pis.length; i++)
            min_to_imps[this.mins[i]] = new Set();

        let min;
        let imp;
        for (let i = 0; i < this.minterms; i++) {
            min = this.mins[i];
            for (let j = 0; j < this.pis; j++) {
                imp = this.pis[j];
                if (this.is_covered(min, imp)) {
                    imp_to_mins[imp].add(min);
                    min_to_imps[min].add(imp)
                }
            }
        }
        let cov = {imp_to_mins, min_to_imps};
        return cov;
    }

    get_pis() {
        let pis = new Set();
        let imps_all = [this.mins_dcs];
        for (let i = 1; i < this.n+1; i++) {
            imps_all.push(new Set());
        }

        let size;
        let used_once;
        let differ;
        for (let i = 0; i < imps_all.length; i++) {
            size = Array.from(imps_all[i]);
            for (let imp1 in size) {
                used_once = false;
                for (let imp2 in size) {
                    differ = this.dffer_by_one_bit(imp1, imp2);
                    if (differ) {
                        used_once = true;
                        imps_all[i+1].add(differ);
                    }
                }
                if (!used_once) {
                    pis.add(imp1);
                }
            }
        return pis;
        }
    }

    get_epis() {
        let epis = new Set();

        for (const [min, pi] of Object.entries(this.min_to_imps)) {
            if (pi.length === 1)
                epis = union(pi, this.prime_implicants);
        }

        return epis;
    }

    is_covering_all_minterms(possible_min_sop) {
        let cov = new Set();
        for(imp in possible_min_sop) {
            for (min in this.mins) {
                if (this.is_covered(min, imp)) {
                    cov.add(min);
                }
            }
        }
        return set_eq(cov, this.mins);
    }

    get_all_min_sop_forms() {
        let mins_notcov = this.mins.map((min) => min) // copy
        let i;
        for (let epi in this.epis) {
            for (min in this.implicant_to_minterms[epi]) {
                if (mins_notcov.includes(min)) {
                    i = mins_notcov.indexOf(min); // js is stupid
                    mins_notcov.splice(i, 1);
                }
            }
        }

        if (mins_notcov.length === 0) {
            return Array.from(this.epis)
        }

        let uimp = new Set();
        for (let min in mins_notcov) {
            for (pi in this.min_to_imps[min]) {
                uimp.add(pi);
            }
        }

        let combos = [];
        let perms;
        for (let i = 1; i < mins_notcov+1; i++) {
            perms = getPermutations(uimp, i);
            combos.push(... perms);
        }

        let sops = [];
        let len = 0;
        let s;
        for (c in combos) {
            s = Array.from(this.epi);
            s.push(... c);
            if (this.is_covering_all_minterms(s)) {
                if (len === 0) {
                    len = this.count_literals(s);
                    sops.push(s);
                }
                else if(this.count_literals(s) === len)
                    sops.append(s);
            }
        }
        return sops;
    }

    constructor(n, mins, dcs) {
        this.n = n;
        this.mins = mins
        this.dcs = dcs;
        this.__setup()
    }
};

module.exports = Kmap;
