// Create array of grid elements
var arr = [[], [], [], [], [], [], [], [], []];

for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);
	}
}
// Allow user to click and type numbers into cells
for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		arr[i][j].contentEditable = true;
		arr[i][j].addEventListener("input", function (e) {
			let val = e.target.innerText.trim();
			if (val === "" || /^[1-9]$/.test(val)) {
				e.target.innerText = val; // allow only 1–9
			} else {
				e.target.innerText = "";
			}
		});
	}
}


// Default Sudoku puzzle (0 means empty) 
var board = [
	[3, 0, 6, 5, 0, 8, 4, 0, 0],
	[5, 2, 0, 0, 0, 0, 0, 0, 0],
	[0, 8, 7, 0, 0, 0, 0, 3, 1],
	[0, 0, 3, 0, 1, 0, 0, 8, 0],
	[9, 0, 0, 8, 6, 3, 0, 0, 5],
	[0, 5, 0, 0, 9, 0, 6, 0, 0],
	[1, 3, 0, 0, 0, 0, 2, 5, 0],
	[0, 0, 0, 0, 0, 0, 0, 7, 4],
	[0, 0, 5, 2, 0, 6, 3, 0, 0]
];

// Fill Sudoku grid on screen
function FillBoard(board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] !== 0) {
				arr[i][j].innerText = board[i][j];
			} else {
				arr[i][j].innerText = '';
			}
		}
	}
}

// Check if number can be placed
function isSafe(board, row, col, num) {
	// Check row and column
	for (let x = 0; x < 9; x++) {
		if (board[row][x] === num || board[x][col] === num) {
			return false;
		}
	}

	// Check 3x3 box
	let startRow = row - (row % 3);
	let startCol = col - (col % 3);
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (board[i + startRow][j + startCol] === num) {
				return false;
			}
		}
	}

	return true;
}

// Backtracking Sudoku solver
function SudokuSolver(board, row, col) {
	if (row === 9) return true;
	if (col === 9) return SudokuSolver(board, row + 1, 0);
	if (board[row][col] !== 0) return SudokuSolver(board, row, col + 1);

	for (let num = 1; num <= 9; num++) {
		if (isSafe(board, row, col, num)) {
			board[row][col] = num;
			if (SudokuSolver(board, row, col + 1)) return true;
			board[row][col] = 0;
		}
	}

	return false;
}
GetPuzzle.onclick = function () {
	var xhrRequest = new XMLHttpRequest();
	xhrRequest.onload = function () {
		var response = JSON.parse(xhrRequest.response);
		console.log(response);
		// Extract the puzzle from the new API
		board = response.newboard.grids[0].value;
		FillBoard(board);
	};
	xhrRequest.open('get', 'https://sudoku-api.vercel.app/api/dosuku');
	xhrRequest.send();
};


SolvePuzzle.onclick = function () {
	// Read current user inputs into the board
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			let val = arr[i][j].innerText.trim();
			board[i][j] = val === "" ? 0 : parseInt(val);
		}
	}

	// Solve the Sudoku
	if (SudokuSolver(board, 0, 0)) {
		FillBoard(board);
		alert("Puzzle Solved!");
	} else {
		alert("No valid solution found!");
	}
};

