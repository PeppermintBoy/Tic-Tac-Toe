//only using modular functions

const gameBoard = (function () {
	//private Method
	let _gameBoardTicks = [];
	let _gameBoardPositionX = [];
	let _gameBoardPositionO = [];
	function storePosition(boxId, xO) {
		if (xO == 'o') {
			_gameBoardPositionO.push(boxId);
		} else {
			_gameBoardPositionX.push(boxId);
		}
	}
	function pushToGameBoardTicks(input) {
		_gameBoardTicks.push(input);
	}
	function infoGameBoardTicks() {
		return _gameBoardTicks;
	}
	function infoGameBoardPositionX() {
		const sortedNum = _gameBoardPositionX.sort();
		return sortedNum;
	}
	function infoGameBoardPositionO() {
		const sortedNum = _gameBoardPositionO.sort();
		return sortedNum;
	}
	//public Method
	return {
		storePosition,
		infoGameBoardTicks,
		pushToGameBoardTicks,
		infoGameBoardPositionO,
		infoGameBoardPositionX,
	};
})();

const displayController = (function () {
	//private Method
	let playerWon = false;
	const boxes = Array.from(document.getElementsByClassName('board-box'));
	boxes.forEach(box => {
		box.addEventListener('click', assignPosition);
	});
	function assignPosition(e) {
		let boxId = e.target.id;
		//prevents tick on already ticked box
		if (e.target.textContent) {
			return;
		}
		const xO = xOLogic();
		winCondition(
			gameBoard.infoGameBoardPositionX(),
			gameBoard.infoGameBoardPositionO()
		);
		gameBoard.storePosition(boxId, xO);
		gameBoard.pushToGameBoardTicks(xO);
		displayTick(xO, boxId);

		tieCondition();

		computer.finalOutput(e);
	}
	function xOLogic() {
		if (
			//see if the last tick is "x" or "o"
			gameBoard.infoGameBoardTicks()[
				gameBoard.infoGameBoardTicks().length - 1
			] == 'x'
		) {
			return 'o';
		} else {
			return 'x';
		}
	}
	function displayTick(xO, boxId) {
		const box = document.getElementById(boxId);
		box.textContent = xO;
	}
	function winCondition(x, o) {
		const winCondition = [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			[1, 4, 7],
			[2, 5, 8],
			[3, 6, 9],
			[1, 5, 9],
			[3, 5, 7],
		];
		for (let i = 0; i < winCondition.length; i++) {
			let first, second, third;
			for (let f = 0; f < winCondition[i].length; f++) {
				if (f == 0) {
					first = winCondition[i][f].toString();
				} else if (f == 1) {
					second = winCondition[i][f].toString();
				} else if (f == 2) {
					third = winCondition[i][f].toString();
				}
			}
			if (x.includes(first) && x.includes(second) && x.includes(third)) {
				alert('x player wins');
				playerWon = true;
				disableGameBoard();
				return players.restart();
			} else if (o.includes(first) && o.includes(second) && o.includes(third)) {
				alert('o player wins');
				playerWon = true;
				disableGameBoard();
				return players.restart();
			}
		}
	}
	function tieCondition() {
		const isBoardFilled = boxes.every(box => {
			if (box.textContent) {
				return true;
			}
		});
		if (isBoardFilled && playerWon == false) {
			alert(`It's a tie`);
			disableGameBoard();
			return players.restart();
		}
	}
	function disableGameBoard() {
		const gameBoard = document.getElementById('game-board');
		gameBoard.classList.add('disableDiv');
	}
	//public Method
	return { assignPosition };
})();

const players = (function () {
	//private Methods
	function getPlayerNames() {
		const modal = document.getElementById('modalPlayerNames');
		const submitBtn = document.getElementById('submit');
		let playerNameInput = document.getElementById('my-form');
		let player1NameDisplay = document.getElementById('player1-display');
		let player2NameDisplay = document.getElementById('player2-display');
		modal.style.display = 'block';
		submitBtn.onclick = () => {
			modal.style.display = 'none';
			if (playerNameInput[0].value && playerNameInput[1].value) {
				player1NameDisplay.textContent = `Player X : ${playerNameInput[0].value}`;
				player2NameDisplay.textContent = `Player O : ${playerNameInput[1].value}`;
			} else if (playerNameInput[1].value) {
				player2NameDisplay.textContent = `Player X : ${playerNameInput[1].value}`;
			} else if (playerNameInput[0].value) {
				player1NameDisplay.textContent = `Player O : ${playerNameInput[0].value}`;
			}
			return false; //prevents page refresh
		};
	}
	function restart() {
		const restartBtn = document.getElementById('restartBtn');
		restartBtn.style.display = 'inline';
		restartBtn.onclick = () => {
			location.reload();
		};
	}
	//public Method
	return { getPlayerNames, restart };
})();

// players.getPlayerNames();

const computer = (function () {
	const boxes = Array.from(document.getElementsByClassName('board-box'));

	function combineXOdata() {
		//find Ids that are not taken
		const allTileIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
		const xoCombined = [
			...gameBoard.infoGameBoardPositionO(),
			...gameBoard.infoGameBoardPositionX(),
		];

		for (let i = 0; i < allTileIds.length; i++) {
			const index = allTileIds.indexOf(xoCombined[i]);
			if (index !== -1) {
				allTileIds.splice(index, 1);
			}
		}
		console.log(`after: ${allTileIds}`);
		return allTileIds; //final result of spliced array
	}
	function randomizeId() {
		let randomizeIds = combineXOdata();
		let randomizedId = Math.floor(Math.random() * randomizeIds.length);
		const choosenId = randomizeIds[randomizedId];
		console.log(`randomizedId: ${choosenId}`);
		return choosenId;
	}
	function click() {
		//click on randomized tile
		let randomizedId = randomizeId();
		let choosenDiv = document.getElementById(randomizedId);
		choosenDiv.click();
	}
	function finalOutput(e) {
		//delay comuter play on tile
		if (e.target.textContent == 'x') {
			setTimeout(function () {
				click();
			}, 200);
		}
	}

	return { finalOutput };
})();
