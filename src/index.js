const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection!')
    socket.emit('msg', "Welcome User")

    socket.on('sendMsg', (userMsg) => {
        io.emit('msg', userMsg)
    })
})

server.listen(port, () => {
    console.log(`Server initialized on port ${port}`)
})