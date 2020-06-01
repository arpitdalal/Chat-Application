const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection!')
    
    socket.emit('msg', "Welcome User") //sends to that particular connection(browser)
    socket.broadcast.emit('msg', 'A new user has joined!') //sends message to everyone else the new user

    socket.on('sendMsg', (userMsg, callback) => {
        const filter = new Filter()
        
        if(filter.isProfane(userMsg)){
            return callback('Profanity is not allowed!')
        }
        
        io.emit('msg', userMsg) // sends to every connections(browsers)
        callback()
    })

    socket.on('sendLocation', (userLocation, callback) => {
        io.emit('msg', `Location: ${userLocation}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('msg', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log(`Server initialized on port ${port}`)
})