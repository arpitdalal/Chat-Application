const socket = io()

socket.on('msg', (msg) => {
    console.log(msg)
})

document.querySelector('#chatForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const userMsg = e.target.elements.userMsg.value
    socket.emit('sendMsg', userMsg)
})

document.querySelector('#sendLocation').addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Your browser do not support geolocation!')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`)
    })
})