var socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');

let userName = prompt('Enter your name');
let roomName = prompt('Enter a room name');

//Event emit functions

socket.emit('user-joined', {
	user: userName,
	room: roomName,
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
//Server event handlers
socket.on('message-sent', message => {
	createMessage(message.message, 'left', message.user);
});

socket.on('user-joined', cb => {
	createMessage(`A new user '${cb.user}' has joined`, `left`, `Socket Bot`);
});

socket.on('user-list-update', cb => {
	renderUserList(cb);
});

//
//
//
//Middleware

function renderUserList(list) {
	let roomUsers = document.getElementById('user-list');
	roomUsers.innerHTML = '';

	list.forEach(e => {
		let user = document.createElement('div');
		user.textContent = e.name;
		user.classList.add('user-name');
		roomUsers.appendChild(user);
	});
}

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
	const messages = document.getElementById('messages');

	let item = document.createElement('div');
	item.innerHTML = `
		<div class="message-${dir}">
			<div class="user-name"><div>${userName}</div> <div class="time">${GetTime()}</div></div>
			<div class="message">${msg}</div>
		</div>
    `;
	item.classList.add('message-wrapper');
	messages.appendChild(item);

	messages.scrollTop += 1000;
}
