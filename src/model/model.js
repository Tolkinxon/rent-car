const fs = require('fs/promises');
const serverConfig = require('../config');
const { dbPath, tempFilePath } = serverConfig;

async function readFile(fileName){
    let data = await fs.readFile(dbPath(fileName), 'utf-8');
    return data ? JSON.parse(data):[];
}

async function writeFile(fileName, data){
    await fs.writeFile(dbPath(fileName), JSON.stringify(data, null, 4));
    return true;
}

async function writeTempFile(fileName, data){
    await fs.writeFile(tempFilePath(fileName), data);
    return true;
}

module.exports = { readFile, writeFile, writeTempFile }