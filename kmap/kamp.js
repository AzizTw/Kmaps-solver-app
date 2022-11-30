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
        this.minterms_and_dont_cares = union(this.minterms, this.dont_cares)
        this.prime_implicants = this.get_prime_implicants();
        let tmp = this.get_coverage_dicts();
        this.implicant_to_minterms = tmp.implicant_to_minterms;
        this.minterm_to_implicants = tmp.minterms_to_implicants;
        this.essential_prime_implicants = this.get_essential_prime_implicants();
    }

     to_binary(num) {
         let binary_num = num.toString(2);
         let diff = this.num_of_vars - binary_num.length
         if (diff != 0)
             binary_num = "0".repeat(diff) + binary_num; // 0 extension to the left
         return binary_num;
     }

    dffer_by_one_bit(minterm1, minterm2) {
        let differ_count = 0;
        let final_num = "";
        let z = zip(minterm1, minterm2);

        let b1; // bit1
        let b2; // bit2
        for (let i = 0; i < z.length; i++) {
            b1 = z[i][0];
            b2 = z[i][1];
            if (b1 !== b2) {
                differ_count++;
                final_num += "-";
            }
            else {
                final_num += b1;
            }
        }

        if (differ_count == 1)
            return final_num;
        else
            return false;
    }

    translate_implicant(implicant) {
        if (count(implicant, "-") === implicant.length)
            return "1";
        returned_implicant = "";

        // workaround for the lack of ord() in js
        const A = 65;

        let bit;
        for (let i = 0; i < implicant.length; i++) {
            bit = implicant[i];
            if (bit === "0")
                returned_implicant += String.fromCharCode(A+i) + "'";
            else if (bit === "1")
                returned_implicant += String.fromCharCode(A+i);
        }

        return returned_implicant
    }

    count_literals(sop) {
        for (let i = 0; i < sop.length; i++) {
            let implicant = sop[i];
            sum += (implicant - count(implicant, "-"));
        }
        return sum;
    }

    is_covered(minterm, implicant) {
        let is_covered = true;
        let z = zip(minterm, implicant);
        let implicant_bit;
        let minterm_bit;
        for (let i = 0; i < z.lenght; i++) {
            minterm_bit = z[i][0];
            implicant_bit = z[i][1];
            if (implicant_bit === "-")
                continue;
            else if (implicant_bit !== minterm_bit) {
                is_covered = false;
                break;
            }
        }
        return is_covered;
    }

    // we don't have dicts in python, so we're using objects
    get_coverage_dicts() {
        let implicant_to_minterms = {};
        for (let i = 0; i < this.prime_implicants.length; i++)
            implicant_to_minterms[this.prime_implicants[i]] = new Set();

        let minterms_to_implicants = {};
        for (let i = 0; i < this.prime_implicants.length; i++)
            minterms_to_implicants[this.minterms[i]] = new Set();

        let minterm;
        let implicant;
        for (let i = 0; i < this.minterms; i++) {
            minterm = this.minterms[i];
            for (let j = 0; j < this.prime_implicants; j++) {
                implicant = this.prime_implicants[j];
                if (this.is_covered(minterm, implicant)) {
                    implicant_to_minterms[implicant].add(minterm);
                    minterms_to_implicants[minterm].add(implicant)
                }
            }
        }
        return {implicant_to_minterms, minterms_to_implicants};
    }

    get_prime_implicants() {
        let prime_implicants = new Set();
        let implicants_all_sizes = [this.minterms_and_dont_cares];
        for (let i = 1; i < this.num_of_vars+1; i++) {
            implicants_all_sizes.push(new Set());
        }

        let size;
        let used_once;
        let differ;
        for (let i = 0; i < implicants_all_sizes.length; i++) {
            size = implicants_all_sizes[i];
            for (let implicant1 in size) {
                used_once = false;
                for (let implicant2 in size) {
                    differ = this.dffer_by_one_bit(implicant1, implicant2);
                    if (differ) {
                        used_once = true;
                        implicants_all_sizes[i+1].add(differ);
                    }
                }
                if (!used_once) {
                    prime_implicants.add(implicant1)
                }
            }
        }
        return prime_implicants;
    }

    get_essential_prime_implicants() {
        let epi = new Set();

        for (const [minterm, prime_implicant] of Object.entries(this.minterm_to_implicants)) {
            if (prime_implicant.length === 1)
                epi = union(epi, this.prime_implicants);
        }

        return epi;
    }

    is_covering_all_minterms(possible_min_sop) {
        let covered = new Set();
        for(imp in possible_min_sop) {
            for (min in this.minterms) {
                if (this.is_covered(min, imp)) {
                    covered.add(min);
                }
            }
        }
        return set_eq(covered, this.minterms);
    }

    get_all_min_sop_forms() {
        let mins_notcov = this.minterms.map((min) => min) // copy
        let i;
        for (let epi in this.essential_prime_implicants) {
            for (min in this.implicant_to_minterms[epi]) {
                if (mins_notcov.includes(min)) {
                    i = mins_notcov.indexOf(min); // js is stupid
                    mins_notcov.splice(i, 1);
                }
            }
        }

        if (mins_notcov.length === 0) {
            return Array.from(this.essential_prime_implicants)
        }

        let uimp = new Set();
        for (let min in mins_notcov) {
            for (pi in this.minterm_to_implicants[min]) {
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
            s = Array.from(this.essential_prime_implicants);
            s.push(... c);
            if (this.is_covering_all_minterms(s)) {
                if (len === 0) {
                    len = this.count_literals(s);
                    sops.push(s);
                }
                else if(this.count_literals(s) == len)
                    sops.append(s);
            }
        }
        return sops;
    }

    constructor(num_of_vars, minterms, dont_cares) {
        this.num_of_vars = num_of_vars;
        this.minterms = minterms
        this.dont_cares = dont_cares;
        this.__setup()
    }


};

module.exports = Kmap;
