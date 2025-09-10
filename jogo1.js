// Elementos
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const gameOverScreen = document.getElementById('gameOver');
const winnerMessage = document.getElementById('winnerMessage');
const restartBtn = document.getElementById('restartBtn');
const exitBtn = document.getElementById('exitBtn');
const scoreOElement = document.getElementById('scoreO');
const scoreXElement = document.getElementById('scoreX');
const exitModal = document.getElementById('exitModal');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

// Estado do jogo
let currentPlayer = 'polvo'; // 🐙 começa
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scoreO = 0;
let scoreX = 0;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
    [0, 4, 8], [2, 4, 6]             // diagonais
];

// Inicializa bolhas
function createBubbles() {
    const bubblesContainer = document.getElementById('bubbles');
    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        const size = Math.random() * 0.9375 + 0.3125; // 5px a 20px → rem
        bubble.style.width = `${size}rem`;
        bubble.style.height = `${size}rem`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 8 + 5}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        bubblesContainer.appendChild(bubble);
    }
}

// Atualiza status
function updateStatus(message) {
    statusDisplay.textContent = message;
}

// Verifica vitória
function checkWin() {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a]; // retorna 'polvo' ou 'peixe'
        }
    }
    return null;
}

// Verifica empate
function checkDraw() {
    return !gameState.includes('');
}

// Fim de jogo
function handleGameEnd(winner = null) {
    gameActive = false;
    if (winner) {
        winnerMessage.textContent = winner === 'polvo' ? '🐙 Polvo Venceu!' : '🐟 Peixe Venceu!';
        if (winner === 'polvo') scoreO++;
        else scoreX++;
        scoreOElement.textContent = scoreO;
        scoreXElement.textContent = scoreX;
    } else {
        winnerMessage.textContent = '🤝 Empatou!';
    }
    gameOverScreen.style.display = 'flex';
}

// Clique na célula
function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (gameState[index] !== '' || !gameActive) return;

    gameState[index] = currentPlayer;
    cell.classList.add(currentPlayer);

    const winner = checkWin();
    if (winner) {
        handleGameEnd(winner);
        return;
    }

    if (checkDraw()) {
        handleGameEnd();
        return;
    }

    currentPlayer = currentPlayer === 'polvo' ? 'peixe' : 'polvo';
    updateStatus(`Vez do ${currentPlayer === 'polvo' ? '🐙' : '🐟'}`);
}

// Reiniciar jogo
function restartGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'polvo';
    cells.forEach(cell => {
        cell.classList.remove('polvo', 'peixe');
    });
    updateStatus('Vez do 🐙');
    gameOverScreen.style.display = 'none';
}

// Abrir modal de saída
exitBtn.addEventListener('click', () => {
    exitModal.style.display = 'flex';
});

// Fechar modal com "Não"
noBtn.addEventListener('click', () => {
    exitModal.style.display = 'none';
});

// Sair com "Sim"
yesBtn.addEventListener('click', () => {
    alert("Obrigado por jogar! 🐠");
    location.reload(); // ou redirecione para outra página
});

// Fechar modal clicando fora
window.addEventListener('click', (e) => {
    if (e.target === exitModal) {
        exitModal.style.display = 'none';
    }
});

// Eventos
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);

// Inicia
createBubbles();
updateStatus('Vez do 🐙');