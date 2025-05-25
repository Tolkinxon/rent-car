const token = window.localStorage.getItem('token');
if(!token) window.location = '/login';
const socket = io('/app', { auth: {token} });

const elForm = document.querySelector('.js-form');
const elEditForm = document.querySelector('.js-edit-form');
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

elEditForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    let formData = new FormData(elEditForm);
    formData = Object.fromEntries(formData)

    const file = formData.image;
    delete formData.image;

    const reader = new FileReader();
    const id = window.localStorage.getItem('editId');
    
    reader.onload = function () {
      const base64 = reader.result.split(',')[1]; 
      socket.emit('editData', { file: base64, formData, id });
      console.log({ file: base64, formData, id });
      
    };
    reader.readAsDataURL(file);
    closeEditModal();
});

elList.addEventListener('click',(evt)=>{
  const edit = evt.target.matches('.edit');
  const deletE = evt.target.matches('.delete');

  if(edit){
    window.localStorage.setItem('editId', evt.target.dataset.id)
    socket.emit('data');
    socket.on('getData', (cars)=>{
      const foundCar = cars.find(item => item.id == evt.target.dataset.id);
      openEditModal(foundCar.name, foundCar.description, foundCar.price);
    });
   }
  if(deletE){openDeleteModal(); window.localStorage.setItem('deleteId', evt.target.dataset.id)}
  
  })

socket.emit('data');
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

  socket.on('editSuccess', (data) => {
    alert(data.message);
    window.location.reload();
  });

  socket.on('editError', (data) => {
    alert('Upload failed: ' + data.error);
  });

        function openEditModal(name = '', description = '', price = '') {
            document.getElementById('editModal').style.display = 'block';
            // document.getElementById('editName').value = name;
            // document.getElementById('editDescription').value = description;
            // document.getElementById('editPrice').value = price;

            elEditForm.elements['name'].value = name;
            elEditForm.elements['price'].value = price;
            elEditForm.elements['description'].value = description;
        }

        function closeEditModal() {
            document.getElementById('editModal').style.display = 'none';
        }

        function openDeleteModal() {
            document.getElementById('deleteModal').style.display = 'block';
        }

        function closeDeleteModal() {
            document.getElementById('deleteModal').style.display = 'none';
        }

        function confirmDelete() {
            closeDeleteModal();
            alert('Mashina o\'chirildi!');
        }

        function closeModalOnOutside(event, modalId) {
            if (event.target.id === modalId) {
                document.getElementById(modalId).style.display = 'none';
            }
        }