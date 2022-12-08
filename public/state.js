export class State {
    constructor() {
        this.kmap = document.querySelector('.kmap');
        this.select = document.getElementById('kmapSize')
        this.solbox = document.getElementById("solutionBox");

        this.setN(parseInt(this.select.value));
    }

    setN(n) {
        this.n = n;
        let dim = this.kmapDim(this.n);
        this.nRows = dim.rows;
        this.nCols = dim.columns;
    }

    getCells() {
        return this.kmap.children;
    }

    // Given the num_vars in a kmap, it returns the appropriate number of rows and
    // columns
    kmapDim(num_vars) {
        let rows = 2 ** Math.floor(num_vars / 2);
        let columns = 2 ** Math.floor((num_vars + 1) / 2);

        return { rows, columns };
    }
}
