// Estado do jogo
let currentPlayer = 'octopus'; // Polvo começa
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let octopusScore = 0;
let clownfishScore = 0;

// Elementos
const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetBtn');
const scoreOctopus = document.getElementById('score-octopus');
const scoreClownfish = document.getElementById('score-clownfish');
const bubblesContainer = document.getElementById('bubbles');

// Mensagens
const winMessage = () => `🎉 ${currentPlayer === 'octopus' ? 'O POLVO VENCEU!' : 'O PEIXE-PALHAÇO VENCEU!'}`;
const drawMessage = () => `🟰 EMPATE!`;
const currentPlayerTurn = () => `${currentPlayer === 'octopus' ? 'Polvo' : 'Peixe-palhaço'} está jogando...`;

// Criar bolhas
function createBubbles() {
    for (let i = 0; i < 25; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = Math.random() * 15 + 5;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 8 + 5}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        
        bubblesContainer.appendChild(bubble);
    }
}

// Inicializa o jogo
function initGame() {
    createBubbles();
    statusDisplay.innerHTML = currentPlayerTurn();
    
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', restartGame);
}

// Lida com clique na célula
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    checkResult();
}

// Marca a jogada
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer);
}

// Verifica resultado
function checkResult() {
    let roundWon = false;

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winMessage();
        gameActive = false;
        
        if (currentPlayer === 'octopus') {
            octopusScore++;
            scoreOctopus.textContent = octopusScore;
        } else {
            clownfishScore++;
            scoreClownfish.textContent = clownfishScore;
        }
        return;
    }

    // Verifica empate
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    // Alterna jogador
    currentPlayer = currentPlayer === 'octopus' ? 'clownfish' : 'octopus';
    statusDisplay.innerHTML = currentPlayerTurn();
}

// Reinicia o jogo
function restartGame() {
    gameActive = true;
    currentPlayer = 'octopus';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    
    cells.forEach(cell => {
        cell.classList.remove('octopus');
        cell.classList.remove('clownfish');
    });
}

// Inicia o jogo
initGame();