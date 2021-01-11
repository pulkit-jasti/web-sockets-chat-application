var socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const test = document.getElementById('test-btn');

let userName = prompt('Enter your name');
let roomName = prompt('Enter a room name');

//Server event handlers
socket.on('message-sent', message => {
	createMessage(message.message, 'left', message.user);
});

socket.on('user-joined', cb => {
	createMessage(`A new user '${cb.userName}' has joined`, `left`, `Socket Bot`);
	//alert('new user has joined');
	console.log(cb);
});

//Event emit functions

socket.emit('user-joined', {
	userName: userName,
	roomName: roomName,
});

form.addEventListener('submit', e => {
	e.preventDefault();
	if (input.value) {
		socket.emit('message-sent', {
			user: userName,
			message: input.value,
			room: roomName,
		});
		createMessage(input.value, 'right', 'Me');
		input.value = '';
	} else {
		alert('Enter something in the text field');
	}
});

//
//
//
//Middleware

function GetTime() {
	let d = new Date();
	let n = d.getHours();

	if (n > 12) {
		var time = `${n - 12}:${d.getMinutes()} PM`;
	} else {
		var time = `${n}:${d.getMinutes()} AM`;
	}

	return time;
}

function createMessage(msg, dir, userName) {
	let item = document.createElement('div');
	item.innerHTML = `
        <div class="user-name"><div>${userName}</div> <div class="time">${GetTime()}</div></div>
        <div class="message">${msg}</div>
    `;
	item.classList.add(`message-${dir}`);
	messages.appendChild(item);
}
