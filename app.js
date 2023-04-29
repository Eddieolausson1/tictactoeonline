const socket = io('http://localhost:3000');

const cells = document.querySelectorAll('[data-cell]');
const message = document.querySelector('.message');

let currentTurn;

startGame();

function startGame() {
	currentTurn = 'X';
	cells.forEach(cell => {
		cell.classList.remove('X');
		cell.classList.remove('O');
		cell.addEventListener('click', handleClick, { once: true });
	});
	setMessage(`${currentTurn}'s turn`);
}

function handleClick(event) {
	const cell = event.target;
	const cellIndex = Array.from(cells).indexOf(cell);
	socket.emit('move', cellIndex, currentTurn);
}

socket.on('move', (cellIndex, turn) => {
	const cell = cells[cellIndex];
	cell.classList.add(turn);
	cell.removeEventListener('click', handleClick);
	if (turn === 'X') {
		currentTurn = 'O';
		setMessage(`${currentTurn}'s turn`);
	} else {
		currentTurn = 'X';
		setMessage(`${currentTurn}'s turn`);
	}
	checkWin();
});

function checkWin() {
	const winningCombos = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	winningCombos.forEach(combo => {
		const [a, b, c] = combo;
		if (
			cells[a].classList.contains(currentTurn) &&
			cells[b].classList.contains(currentTurn) &&
			c
