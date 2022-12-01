const express = require('express');
const kmap = require('./kmap/kamp');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

// use nunjucks as a view engine
const nunjucks = require("nunjucks");
nunjucks.configure('views', {express: app});

app.get('/', (req, res) => {
    res.render("calc.html");
});

app.post('/', (req, res) => {
    let n = req.body.n;
    let mins = req.body.mins;
    let dcs = req.body.dcs;
    let sol = kmap.solve(n, mins, dcs);
    res.json(sol);
})

const PORT = 3000;
app.listen(PORT, (e) => {
    if (e)
        console.error(e);
    console.log("listining on localhost:" + PORT);
})
