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
    socket.on('data', async ()=>{
      socket.emit('getData', cars);
    })

    socket.on('uploadData', async (data) => {
      try {
        const buffer = Buffer.from(data.file, 'base64');
        await writeTempFile('tempFile.jpg', buffer);
        
        const result = await cloudinary.uploader.upload(tempFilePath('tempFile.jpg'), {
          folder: 'cars/assets'
        });
      await fs.unlink(tempFilePath('tempFile.jpg'));

      const cars = await readFile('cars');
      const newCar = {id: cars.length?cars.at(-1).id+1:1, ...data.formData, img_url: result.secure_url, public_id: result.public_id}
      cars.push(newCar)
      await writeFile('cars', cars);
        socket.emit('uploadSuccess', { message: 'Data successfully uploaded' });
      } catch (err) {
        socket.emit('uploadError', { error: err.message });
      }
    });
    socket.on('editData', async (data) => {
      try {
        const cars = await readFile('cars');   
        const foundIndex = cars.findIndex(item => item.id == data.id);

      if(data.file) {
          cloudinary.uploader.destroy(cars[foundIndex].public_id, (error, result) => {
          if (error) {
            console.error("O'chirish xatosi:", error);
          } else {
            console.log("O'chirish muvaffaqiyatli:", result);
          }
        }); 
        
        const buffer = Buffer.from(data.file, 'base64');
        await writeTempFile('tempFile.jpg', buffer);
        const result = await cloudinary.uploader.upload(tempFilePath('tempFile.jpg'), {
          folder: 'cars/assets'
        });
        fs.unlink(tempFilePath('tempFile.jpg'));
        cars[foundIndex].img_url = result.secure_url;
      } 
     
        cars[foundIndex] = {...cars[foundIndex],...data.formData};
        await writeFile('cars', cars);
        socket.emit('editSuccess', { message: 'Data successfully updated' });

      } catch (err) {
        socket.emit('editError', { error: err.message });
      }
    });
}

module.exports = appSocketCallBack;

// url: result.secure_url