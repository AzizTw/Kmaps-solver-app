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

// some pesudo code. We'll do this later
/*
app.get('practice/id', (req, res) => {
    kmap = getKmapById(id); // sql will do this
    n = kmap.n;
    mins = kmap.mins;
    dcs = kmaps.dcs;
    let data = {n, mins, dcs};
    res.send(data)
    res.render("practice.html");
});
*/

// In the future we'll use this to list all possible kmaps and allow the user
// to select from them, but now lets just implement basic practice feature on
// the Kmap hard coded in practice.html
app.get('/practice', (req, res) => {
    res.render("practice.html");
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
