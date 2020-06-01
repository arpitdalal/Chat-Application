const socket = io()

socket.on('msg', (msg) => {
    console.log(msg)
})

document.querySelector('#chatForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const userMsg = e.target.elements.userMsg.value
    socket.emit('sendMsg', userMsg)
})