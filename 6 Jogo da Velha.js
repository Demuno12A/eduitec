document.addEventListener('DOMContentLoaded', () => {

    // --- Bolhas ---
    const bubblesContainer = document.getElementById('bubbles');
    if (bubblesContainer) {
        for (let i = 0; i < 35; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            const size = Math.random() * 20 + 6;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.animationDuration = `${Math.random() * 8 + 6}s`;
            bubble.style.animationDelay = `${Math.random() * 5}s`;
            bubble.style.opacity = (Math.random() * 0.6 + 0.2).toString();
            bubblesContainer.appendChild(bubble);
        }
    }

    // --- Função para salvar pontuação no backend ---
    async function saveScoreToBackend(playerName, score) {
        try {
            const response = await fetch('https://us-central1-default-59bd9.cloudfunctions.net/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playerName: playerName,
                    score: score
                })
            });

            const result = await response.json();
            if (response.ok) {
                console.log("✅ Pontuação salva:", result.message);
                alert("🎉 Pontuação salva com sucesso!");
            } else {
                console.error("❌ Erro ao salvar:", result.error);
                alert("⚠️ Erro ao salvar pontuação: " + result.error);
            }
        } catch (error) {
            console.error("🚨 Erro de conexão:", error);
            alert("🚨 Falha na conexão com o servidor.");
        }
    }

    // --- Jogo da Velha ---
    let currentPlayer = 'polvo';
    let gameActive = true;
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let polvoScore = 0;
    let peixeScore = 0;

    // Elementos do DOM
    const statusDisplay = document.getElementById('status');
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('resetBtn');
    const resetButtonOverlay = document.getElementById('resetBtnOverlay');
    const scorePolvo = document.getElementById('scoreO');
    const scorePeixe = document.getElementById('scoreX');
    const gameOverEl = document.getElementById('gameOver');
    const winnerMessageEl = document.getElementById('winnerMessage');
    const exitBtn = document.getElementById('exitBtn');
    const exitModal = document.getElementById('exitModal');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    // Mensagens
    const winMessage = (player) => `🎉 ${player === 'polvo' ? 'O POLVO VENCEU!' : 'O PEIXE VENCEU!'}`;
    const drawMessage = () => `🟰 EMPATE!`;
    const currentPlayerTurn = () => `${currentPlayer === 'polvo' ? '🐙 Polvo' : '🐟 Peixe'} está jogando...`;

    // Inicializa o jogo
    function initGame() {
        statusDisplay.textContent = currentPlayerTurn();
        
        // Limpa o tabuleiro
        gameState = ["", "", "", "", "", "", "", "", ""];
        cells.forEach(cell => {
            cell.classList.remove('polvo', 'peixe');
            cell.textContent = '';
        });
        
        // Remove listeners antigos e adiciona novos
        cells.forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
            cell.addEventListener('click', handleCellClick);
        });
        
        // Configura botões de reinício
        if (resetButton) {
            resetButton.removeEventListener('click', restartGameKeepScore);
            resetButton.addEventListener('click', restartGameKeepScore);
        }
        
        if (resetButtonOverlay) {
            resetButtonOverlay.removeEventListener('click', restartGameKeepScore);
            resetButtonOverlay.addEventListener('click', restartGameKeepScore);
        }
        
        // Configura botão de saída
        if (exitBtn) {
            exitBtn.removeEventListener('click', showExitModal);
            exitBtn.addEventListener('click', showExitModal);
        }
        
        if (noBtn) {
            noBtn.removeEventListener('click', hideExitModal);
            noBtn.addEventListener('click', hideExitModal);
        }
        
        if (yesBtn) {
            yesBtn.removeEventListener('click', handleExit);
            yesBtn.addEventListener('click', handleExit);
        }
        
        gameActive = true;
        gameOverEl.style.display = 'none';
    }

    // Lida com clique na célula
    function handleCellClick(e) {
        const clickedCell = e.currentTarget;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'), 10);

        if (gameState[clickedCellIndex] !== "" || !gameActive) return;

        // Marca a jogada
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.classList.add(currentPlayer);

        // Verifica resultado
        checkResult();
    }

    // Verifica resultado
    function checkResult() {
        const winConditions = [
            [0,1,2], [3,4,5], [6,7,8], // Linhas
            [0,3,6], [1,4,7], [2,5,8], // Colunas
            [0,4,8], [2,4,6]           // Diagonais
        ];
        
        let roundWon = false;
        for (let [a,b,c] of winConditions) {
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            // Vitória
            winnerMessageEl.textContent = winMessage(currentPlayer);
            gameOverEl.style.display = 'flex';
            gameActive = false;

            if (currentPlayer === 'polvo') {
                polvoScore++;
                scorePolvo.textContent = polvoScore;
                // ✅ Envia pontuação para o backend
                saveScoreToBackend("Polvo", polvoScore);
            } else {
                peixeScore++;
                scorePeixe.textContent = peixeScore;
                // ✅ Envia pontuação para o backend
                saveScoreToBackend("Peixe", peixeScore);
            }
            return;
        }

        if (!gameState.includes("")) {
            // Empate
            winnerMessageEl.textContent = drawMessage();
            gameOverEl.style.display = 'flex';
            gameActive = false;
            return;
        }

        // Alterna jogador
        currentPlayer = currentPlayer === 'polvo' ? 'peixe' : 'polvo';
        statusDisplay.textContent = currentPlayerTurn();
    }

    // Reinicia jogo mantendo placar
    function restartGameKeepScore() {
        initGame();
    }

    // Reinicia jogo zerando placar
    function restartGameResetScore() {
        polvoScore = 0;
        peixeScore = 0;
        scorePolvo.textContent = polvoScore;
        scorePeixe.textContent = peixeScore;
        initGame();
    }

    // Mostra modal de saída
    function showExitModal() {
        exitModal.style.display = 'flex';
    }

    // Esconde modal de saída
    function hideExitModal() {
        exitModal.style.display = 'none';
    }

    // Lida com saída
    function handleExit() {
        restartGameResetScore();
        exitModal.style.display = 'none';
        window.location.href = '6 Inicio Jogos.html';
    }

    // Inicia o jogo
    initGame();
});