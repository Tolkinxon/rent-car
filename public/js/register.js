const token = window.localStorage.getItem('token');
if(token) window.location = '/';

const elForm = document.querySelector('.js-form');
const socket = io('/auth'); 

elForm.addEventListener('submit', (evt)=>{
    evt.preventDefault();

    let formData = new FormData(evt.target);
    formData = Object.fromEntries(formData.entries());

    socket.emit('registered', formData);
    
})

socket.on('authError', (data)=>{
    alert(data.message)
})

socket.on('authSuccess', (data)=>{
    window.localStorage.setItem('token', data.accessToken);
    window.location.reload();
})