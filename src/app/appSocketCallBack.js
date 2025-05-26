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

    function updatedBooking(books, cars, checking){
      const filteredBooks = books.filter(item => item.user_id == checking.id);
      const userBookedCars = [];
      filteredBooks.forEach(item => {
        const foundCar = cars.find(itemCar => itemCar.id == item.car_id)
        const newFoundCar = structuredClone(foundCar);
        if(foundCar != undefined){ newFoundCar.id = item.id; userBookedCars.push(newFoundCar); }
      })
      socket.emit('updatedBooking', userBookedCars);
    }

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
            throw new Error(error)
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
    socket.on('deleteData', async (data) => {
      try {
        const cars = await readFile('cars');   
        const foundIndex = cars.findIndex(item => item.id == data.id);
        cloudinary.uploader.destroy(cars[foundIndex].public_id, (error, result) => {
          if (error) {
            console.error("O'chirish xatosi:", error);
            throw new Error(error)
          } else {
            console.log("O'chirish muvaffaqiyatli:", result);
          }
        }); 
        cars.splice(foundIndex, 1);     
        await writeFile('cars', cars);
        socket.emit('deleteSuccess', { message: 'Data successfully deleted' });
      } catch (err) {
        socket.emit('deleteError', { error: err.message });
      }
    });
    socket.on('booking', async (data)=>{
      const books = await readFile('books');
      const cars = await readFile('cars');
      const newBook = { id: books.length?books.at(-1).id+1:1, user_id: checking.id, car_id: data.id }
      books.push(newBook);
      await writeFile('books', books);
      updatedBooking(books, cars, checking);
    })

    socket.on('removeBooking', async (data)=>{
      const books = await readFile('books');
      const cars = await readFile('cars');
      const foundIndex = books.findIndex(item => item.user_id == checking.id);
      books.splice(foundIndex, 1);
      await writeFile('books', books);
      updatedBooking(books, cars, checking);
    })

    socket.on('bookedCars', async ()=>{
      const books = await readFile('books');
      const cars = await readFile('cars');
      const filteredBooks = books.filter(item => item.user_id == checking.id);
      const userBookedCars = [];
      filteredBooks.forEach(item => {
        const foundCar = cars.find(itemCar => itemCar.id == Number(item.car_id));
        const newFoundCar = structuredClone(foundCar);
        if(foundCar != undefined){ newFoundCar.id = item.id; userBookedCars.push(newFoundCar); }
      })
      socket.emit('updatedBooking', userBookedCars);
    })
}

module.exports = appSocketCallBack;

// url: result.secure_url