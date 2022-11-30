const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

// use nunjucks as a view engine
const nunjucks = require("nunjucks");
nunjucks.configure('views', {express: app});

app.get('/', (req, res) => {
    res.send("Hello world");
});

const PORT = 3000;
app.listen(PORT, (e) => {
    if (e)
        console.error(e);
    console.log("listining on localhost:" + PORT);
})
