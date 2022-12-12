const express = require('express');
const kmap = require('./kmap/kamp');
const sel = require('./data/sel');
const app = express();
const PORT = process.env.PORT || 3000;

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
app.get('/practice', async (req, res) => {
    let info = await sel.getAllKmapInfo();
    res.render("practice.html", {info});
});

app.post('/practice', async (req, res) => {
    let id = req.body.id;
    let query = await sel.getKmapInput(id);
    let inputStr = query.input;
    let input = JSON.parse(inputStr);
    let sol = kmap.solve(input.n, input.mins, input.dcs);
    res.json({sol, input});
});

app.post('/', (req, res) => {
    let n = req.body.n;
    let mins = req.body.mins;
    let dcs = req.body.dcs;
    let sol = kmap.solve(n, mins, dcs);
    res.json(sol);
})

app.listen(PORT, (e) => {
    if (e)
        console.error(e);
    console.log("listening on localhost:" + PORT);
})
