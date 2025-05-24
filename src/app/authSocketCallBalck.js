const { createToken } = require("../lib/tokenService");
const { readFile, writeFile } = require("../model/model");

authSocketCallBack = function(socket){
  socket.on('registered', async (data)=>{
    const users = await readFile('users');
    if(users.some(item => item.email == data.email)) return socket.emit('authError', {message: 'this user already excist'})
    const newUser = { id: users.length?users.at(-1).id+1:1, ...data, createdAt: new Date().toLocaleDateString(), updatedAt:null }
    users.push(newUser);
    await writeFile('users', users);
    return socket.emit('authSuccess', {messge: 'User successfully added!', accessToken: createToken({id: newUser.id})});
  })
    socket.on('login', async (data)=>{
    const users = await readFile('users');
    const foundUser = users.find(item => item.email == data.email);
    console.log(typeof foundUser);
    
    if(foundUser == undefined) return socket.emit('authError', {message: 'this user is not available'})
    if(foundUser?.password != data?.password) return socket.emit('authError', {message: 'this user is not available'})
    return socket.emit('authSuccess', {messge: 'User successfully logged!', accessToken: createToken({id: foundUser.id})});
  })
}

module.exports = authSocketCallBack;