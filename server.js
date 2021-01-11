const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`server started at port: ${PORT}`));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/:parr', (req, res) => {
	res.send(req.params.parr);
});

usersList = [];

io.on('connection', socket => {
	console.log('user connected');

	socket.on('user-joined', cb => {
		socket.join(cb.room);
		socket.to(cb.room).emit('user-joined', cb);

		let currentUser = new User(socket.id, cb.user, cb.room);
		usersList.push(currentUser);

		let currentRoomUsers = usersList.filter(e => {
			return e.room == 'rm1';
		});

		io.to(cb.room).emit('user-list-update', currentRoomUsers);
	});

	socket.on('message-sent', message => {
		socket.to(message.room).emit('message-sent', message);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');

		usersList = usersList.filter(e => {
			return e.id != socket.id;
		});

		let currentRoomUsers = usersList.filter(e => {
			return e.room == 'rm1';
		});

		io.to('rm1').emit('user-list-update', currentRoomUsers);

		console.log(usersList);
	});
});

class User {
	constructor(id, name, room) {
		this.id = id;
		this.name = name;
		this.room = room;
	}
}
