const fs = require('fs/promises');
const cloudinary = require('../lib/cloudinary');
const { tempFilePath } = require("../config");
const { writeTempFile, readFile, writeFile } = require("../model/model");
const checkToken = require('../utils/checktoken');

appSocketCallBack = async function(socket){
    const token = socket.handshake.auth.token;
    const checking = await checkToken(token);
    if(!checking.status) return socket.emit('tokenError', {message: checking.message});
    const cars = await readFile('cars');
    socket.emit('getData', cars);

  socket.on('uploadData', async (data) => {
    try {
      const buffer = Buffer.from(data.file, 'base64');
      await writeTempFile('tempFile.jpg', buffer);
      
      const result = await cloudinary.uploader.upload(tempFilePath('tempFile.jpg'), {
        folder: 'cars/assets'
      });
     fs.unlink(tempFilePath('tempFile.jpg'));

    const cars = await readFile('cars');
    const newCar = {id: cars.length?cars.at(-1).id+1:1, ...data.formData, img_url: result.secure_url}
    cars.push(newCar)
    await writeFile('cars', cars);
      socket.emit('uploadSuccess', { message: 'Data successfully uploaded' });
    } catch (err) {
      socket.emit('uploadError', { error: err.message });
    }
  });
}

module.exports = appSocketCallBack;

// url: result.secure_url