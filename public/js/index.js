const token = window.localStorage.getItem('token');
if(!token) window.location = '/login';
const socket = io('/app', { auth: {token} });

const elForm = document.querySelector('.js-form');
const elList = document.querySelector('.carList');
const elItem = document.querySelector('.carItem').content;

function render(arr, node){
  node.innerHTML = '';
  const fragment = document.createDocumentFragment();
  arr.forEach(item => {
    const clone = elItem.cloneNode(true);
    clone.querySelector('.car_img').src = item.img_url;
    clone.querySelector('.car_name').textContent = item.name;
    clone.querySelector('.car_description').textContent = item.description;
    clone.querySelector('.car_price').textContent = item.price;
    clone.querySelector('.car_edit').dataset.id = item.id;
    clone.querySelector('.car_delete').dataset.id = item.id;

    fragment.append(clone);
  })
  node.append(fragment);
}

elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let formData = new FormData(elForm);
    formData = Object.fromEntries(formData)

    const file = formData.image;
    delete formData.image;
    const reader = new FileReader();
    
    reader.onload = function () {
      const base64 = reader.result.split(',')[1]; 
      socket.emit('uploadData', { file: base64, formData});
    };
    reader.readAsDataURL(file);
});


socket.on('getData', (cars)=>{
  render(cars, elList)
});


  socket.on('tokenError', (data) => {
    alert(data.message);
  });

  socket.on('uploadSuccess', (data) => {
    alert(data.message);
    window.location.reload();
  });

  socket.on('uploadError', (data) => {
    alert('Upload failed: ' + data.error);
  });