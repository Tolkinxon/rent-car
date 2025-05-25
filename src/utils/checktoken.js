const { verifyToken } = require("../lib/tokenService");
const { readFile } = require("../model/model");

 async function checkToken(token){
    if(!token) return {message: 'Token required', status: false}
    const tokenId = verifyToken(token).id;
    const users = await readFile('users');
    if(!users.some(item => item.id == tokenId)) return {message: 'This user is not available', status: false}
    return {message: 'This user is available', status: true, id: tokenId }
}

module.exports = checkToken;