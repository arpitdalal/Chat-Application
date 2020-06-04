const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMsg, generateLocationMsg } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
	console.log('New WebSocket connection!');

	socket.on('join', (options, callback) => {
		const { error, user } = addUser({
			id: socket.id,
			...options
		});

		if (error) {
			return callback(error);
		}

		socket.join(user.room);

		socket.emit('msg', generateMsg('Admin', `Welcome ${user.username}!`)); //sends to that particular user
		socket.broadcast.to(user.room).emit('msg', generateMsg('Admin', `${user.username} has joined!`)); //sends message to everyone else the new user in that room only
		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room)
		});

		callback();
	});

	socket.on('sendMsg', (userMsg, callback) => {
		const user = getUser(socket.id);

		const filter = new Filter();

		if (filter.isProfane(userMsg)) {
			return callback('Profanity is not allowed!');
		}

		io.to(user.room).emit('msg', generateMsg(user.username, userMsg)); // sends to every user
		callback();
	});

	socket.on('sendLocation', (coords, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit('locationMsg', generateLocationMsg(user.username, coords));
		callback();
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('msg', generateMsg('Admin', `${user.username} has left!`));
			io.to(user.room).emit('roomData', {
				room: user.room,
				users: getUsersInRoom(user.room)
			});
		}
	});
});

server.listen(port, () => {
	console.log(`Server initialized on port ${port}`);
});
