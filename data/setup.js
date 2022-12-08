const sqlite = require('aa-sqlite');

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


async function insert() {
    await sqlite.open('./database.db3');


    let input = { n: 4, mins: [ 0, 7, 13, 8 ], dcs: [ 4, 5, 2 ] };
    let origin = "demo.js";
    let link  = "~/uni/swe363-webdev/pro/p3";
    let str = JSON.stringify(input);

    let sql = `INSERT INTO Kmap(n, input, origin, link) VALUES(${input.n}, '${str}', '${origin}', '${link}');`;
    // console.log(sql)
    await sqlite.run(sql);
}

async function select() {
    await sqlite.open('./database.db3');
    let sql = `select * from Kmap`;
    let data = await sqlite.all(sql);
    console.log(data);
}

// create();
// insert();
select();
// sqlite.close();
