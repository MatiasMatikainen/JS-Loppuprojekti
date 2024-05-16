const statusDisplay = document.querySelector('.gamestatus'); // koodirivi hakee HTML-dokumentista elementin jonka luokka on "gamestatus", ja tallentaa sen muuttujaan statusDisplay

let gameActive = true; // asettaa pelin aktiiviseksi
let currentPlayer = "Pelajaa";
let gameState = ["", "", "", "", "", "", "", "", ""]; // taulukko joka edustaa pelilautaa, jokainen taulukon "" merkki vastaa yhtä ruutua pelilaudalla

const winningText = () => `${currentPlayer} Voitti!`; // funktio voittotekstille
const drawText = () => `Tasapeli!`; // funktio tasapelitekstille
const currentPlayerTurn = () => {   // Funktio nykyisen pelaajan vuoron ilmoittamiseksi
    if (currentPlayer === "Pelajaa") {
        return "Pelaajan vuoro";
    } else if (currentPlayer === "Tietokone") {
        return "Tietokoneen vuoro";
    }
};

statusDisplay.innerHTML = currentPlayerTurn(); // Kertoo kumman vuoro on

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick)); // aina kun pelaaja klikkaa pelilaudan ruutua "handleCellClick"-funktio suoritetaan
document.querySelector('.gamerestart').addEventListener('click', handleRestartGame); // aina kun käyttäjä painaa uudelleenkäynnistysnappia "handleRestartGame"-funktio suoritetaan

function handleCellClick(clickedCellEvent) { // tarkistaa onko pelaajan klikkaama ruutu vapaana siirtoa varten
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation(); // funktio, joka arvioi pelituloksen ja tarkistaa onko jompikumpi pelaajista voittanut tai onko peli päätynyt tasapeliin

    document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick)); // estää pelaajaa tekemästä uusia siirtoja pelilaudalla sen aikaa kun tietokoneen siirtoa odotetaan

    if (gameActive && currentPlayer === "Tietokone") {
        setTimeout(() => { // Tietokoneen siirto
            const emptyCells = gameState.map((cell, index) => cell === "" ? index : -1).filter(index => index !== -1); // etsii kaikki tyhjät ruudut
            const randomIndex = Math.floor(Math.random() * emptyCells.length); // valitsee ydhen tyhjän satunnaisen ruudun
            const computerMoveIndex = emptyCells[randomIndex];
            const computerMoveCell = document.querySelector(`.cell[data-cell-index="${computerMoveIndex}"]`);
            handleCellPlayed(computerMoveCell, computerMoveIndex); // Käsittelee tietokoneen siirron
            handleResultValidation(); // Tarkistaa pelitilanteen uudelleen

            document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
        }, 1000); // Tietokoneen siirron aikaviive (1 sekuntti) jonka aikana ruutuja ei voi klikata
    }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer === "Pelajaa" ? "X" : "O"; // Näyttää klikatussa ruudussa joko X tai O merkin
}

const winningConditions = [  // Kaikki mahdolliset voittotilanteet
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleResultValidation() {  // Tarkistaa pelin tilan voiton tai tasapelin varalta
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {  // Jos voittoehto täyttyy kierros merkitään voitetuksi
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) { // Jos kierros on voitettu näytetään voittoteksti ja asetetaan peli epäaktiiviseksi
        statusDisplay.innerHTML = winningText();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes(""); // Jos kaikki ruudut on täynnä eikä kumpikaan voittanut, näytetään "tasapeli" teksti ja asetetaan peli epäakstiiviseksi
    if (roundDraw) {
        statusDisplay.innerHTML = drawText();
        gameActive = false;
        return;
    }

    handlePlayerChange(); // Vaihda pelaajan vuoroa
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "Pelajaa" ? "Tietokone" : "Pelajaa"; // Jos currentPlayer on "Pelajaa" se vaihdetaan "Tietokoneeseen" ja päinvastoin.
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleRestartGame() { // Asettaa pelin tilan alkuperäiseen tilaan 
    gameActive = true;
    currentPlayer = "Pelajaa";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = "";
        cell.addEventListener('click', handleCellClick); 
    });
}