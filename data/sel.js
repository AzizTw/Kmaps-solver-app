const sqlite = require('aa-sqlite');

sqlite.open('./database.db3');

async function getAllKmapInfo() {
    return await sqlite.all("select id, origin from Kmap");
}

async function getKmapById(id) {
    return await sqlite.all("select * from Kmap where id = ?", [id]);
}

async function getKmapInput(id) {
    return await sqlite.get("select input from Kmap where id = ?", [id]);
}

module.exports = {
    getAllKmapInfo,
    getKmapById,
    getKmapInput,
};
