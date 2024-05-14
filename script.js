const statusDisplay = document.querySelector('.gamestatus');

let gameActive = true;
let currentPlayer = "Pelajaa";
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningText = () => `${currentPlayer} Voitti!`;
const drawText = () => `Tasapeli!`;
const currentPlayerTurn = () => {
    if (currentPlayer === "Pelajaa") {
        return "Pelaajan vuoro";
    } else if (currentPlayer === "Tietokone") {
        return "Tietokoneen vuoro";
    }
};

statusDisplay.innerHTML = currentPlayerTurn();

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.gamerestart').addEventListener('click', handleRestartGame);

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick));

    if (gameActive && currentPlayer === "Tietokone") {
        setTimeout(() => {
            const emptyCells = gameState.map((cell, index) => cell === "" ? index : -1).filter(index => index !== -1);
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const computerMoveIndex = emptyCells[randomIndex];
            const computerMoveCell = document.querySelector(`.cell[data-cell-index="${computerMoveIndex}"]`);
            handleCellPlayed(computerMoveCell, computerMoveIndex);
            handleResultValidation();

            document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
        }, 1000); 
    }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer === "Pelajaa" ? "X" : "O";
}

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningText();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawText();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "Pelajaa" ? "Tietokone" : "Pelajaa";
    statusDisplay.innerHTML = currentPlayerTurn();
}