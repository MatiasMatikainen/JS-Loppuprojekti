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

function handlePlayerChange() {
    currentPlayer = currentPlayer === "Pelajaa" ? "Tietokone" : "Pelajaa";
    statusDisplay.innerHTML = currentPlayerTurn();
}