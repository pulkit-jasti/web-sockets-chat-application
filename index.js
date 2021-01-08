const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 5000;

http.listen(port, () => {
	console.log('server started');
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
	console.log('user connected');

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('message-sent', message => {
		console.log(message);
		io.emit('message-sent', message);
	});
});
