var socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const test = document.getElementById('test-btn');

let userName = prompt('Enter your name');

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

socket.on('message-sent', message => {
	createMessage(message.message, 'left', message.user);
});

form.addEventListener('submit', e => {
	e.preventDefault();
	if (input.value) {
		socket.emit('message-sent', {
			user: userName,
			message: input.value,
		});
		createMessage(input.value, 'right', 'Me');
		input.value = '';
	} else {
		alert('Enter something in the text field');
	}
});
