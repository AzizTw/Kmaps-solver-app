const sqlite = require('aa-sqlite');
const fs = require('fs');

async function create() {
    await sqlite.open('./database.db3');

    let sql = `CREATE TABLE IF NOT EXISTS Kmap(id integer primary key autoincrement,
                                                n integer,
                                                input text,
                                                origin text,
                                                link text
                                                );`

    await sqlite.run(sql)
}


async function insertDemo() {
    await sqlite.open('./database.db3');


    let input = { n: 4, mins: [ 0, 7, 13, 8 ], dcs: [ 4, 5, 2 ] };
    let origin = "demo.js";
    let link  = "cooldemo.com";
    let str = JSON.stringify(input);

    let sql = `INSERT INTO Kmap(n, input, origin, link) VALUES(${input.n}, '${str}', '${origin}', '${link}');`;
    // console.log(sql)
    await sqlite.run(sql);
}

async function insert() {
    await sqlite.open('./database.db3');

    str = fs.readFileSync("./data/kmap_data.json").toString();
    data = JSON.parse(str).data;

    for (d of data) {
        let input = JSON.stringify({n: d.n, mins: d.mins, dcs: d.dcs});
        let n = d.n;
        let origin = d.origin;
        let link = d.link;
        let sql = `INSERT INTO Kmap(n, input, origin, link) VALUES(${n}, '${input}', '${origin}', '${link}');`;
        await sqlite.run(sql);
    }
}

async function select() {
    await sqlite.open('./database.db3');
    let sql = `select * from Kmap`;
    let data = await sqlite.all(sql);
    console.log(data);
}

// async function removeDemo() {
//     await sqlite.open('./database.db3');
//     let sql = `delete from Kmap where id = 1`;
//     await sqlite.run(sql);
// }


// create();
// insert();
select();
sqlite.close();
