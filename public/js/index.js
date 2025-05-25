const token = window.localStorage.getItem('token');
if(!token) window.location = '/login';

const socket = io('/app', { auth: {token} });

const elList = document.querySelector('.carList');
const elItem = document.querySelector('.carItem').content;
const elListBooking = document.querySelector('.carListBooking');
const elItemBooking = document.querySelector('.carItemBooking').content;

function render(arr, node, elItem){
  node.innerHTML = '';
  const fragment = document.createDocumentFragment();
  arr.forEach(item => {
    const clone = elItem.cloneNode(true);
    clone.querySelector('.car_img').src = item.img_url;
    clone.querySelector('.car_name').textContent = item.name;
    clone.querySelector('.car_description').textContent = item.description;
    clone.querySelector('.car_price').textContent = item.price;
    clone.querySelector('.car_booking').dataset.id = item.id;

    fragment.append(clone);
  })
  node.append(fragment);
}

socket.emit('data');
socket.on('getData', (cars)=>{
  render(cars, elList, elItem);
});

elList.addEventListener('click', (evt)=>{
    const bookingId = evt.target.matches('.car_booking');
    if(bookingId) {
        socket.emit('booking', { id: evt.target.dataset.id });
        socket.on('updatedBooking',(data)=>{
            render(data, elListBooking, elItemBooking);
        })
    }
})

socket.emit('bookedCars');
socket.on('updatedBooking',(data)=>{
    console.log(data);
    
    render(data, elListBooking, elItemBooking);
})

        function bookCar(button) {
            const row = button.closest('tr');
            const clonedRow = row.cloneNode(true);
            clonedRow.querySelector('button').textContent = 'Remove';
            clonedRow.querySelector('button').setAttribute('onclick', 'removeCar(this)');
            document.querySelector('#bookedTable tbody').appendChild(clonedRow);
        }

        function removeCar(button) {
            const row = button.closest('tr');
            row.remove();
        }