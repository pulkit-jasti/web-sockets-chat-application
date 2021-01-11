const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 5000;

http.listen(port, () => console.log('server started'));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
	console.log('user connected');

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('user-joined', cb => {
		//socket.broadcast.emit('user-joined', cb);
		socket.join(cb.roomName);
		console.log(cb);
	});

	socket.on('message-sent', message => {
		//socket.broadcast.emit('message-sent', message);
		socket.to(message.room).emit('message-sent', message);
	});
});
