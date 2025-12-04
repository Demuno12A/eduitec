/**
 * JOGO DE CARTAS MARINHAS - Versão Profissional
 * Biologia Marinha Educacional
 */

document.getElementById('startBtn').addEventListener('click', () => {
    const name = document.getElementById('playerNameInput').value.trim() || "Jogador";
    localStorage.setItem('usuario', name); // guarda no navegador
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
  
    new MarineCardGame();
  });
  

class MarineCardGame {
    constructor() {
        this.lessons = [
            {
                title: "Etapa 1: Conceitos Fundamentais",
                students: [
                    { name: "🐠", question: "Como as algas marinhas produzem seu próprio alimento?", correctAnswer: "Fotossíntese" },
                    { name: "🐙", question: "Qual processo celular utiliza oxigênio para gerar energia nos organismos?", correctAnswer: "Respiração Celular" },
                    { name: "🦀", question: "Organismos que se alimentam de matéria orgânica em decomposição são chamados de?", correctAnswer: "Decompositores" }
                ],
                answers: ["Fotossíntese", "Respiração Celular", "Decompositores", "Predação", "Simbiose", "Camuflagem"]
            },
            {
                title: "Etapa 2: Cadeia Alimentar Marinha",
                students: [
                    { name: "🦈", question: "Animal que não tem predadores naturais em seu habitat é chamado de?", correctAnswer: "Predador de ápice" },
                    { name: "🦐", question: "Conjunto de organismos microscópicos que flutuam na água e servem de base alimentar?", correctAnswer: "Plâncton" },
                    { name: "🐟", question: "Estratégia de defesa em que o animal se confunde com o ambiente?", correctAnswer: "Camuflagem" }
                ],
                answers: ["Predador de ápice", "Plâncton", "Camuflagem", "Fotossíntese", "Decompositores", "Respiração Celular"]
            },
            {
                title: "Etapa 3: Ecossistemas Marinhos",
                students: [
                    { name: "🐢", question: "Local onde as tartarugas marinhas depositam seus ovos para incubação?", correctAnswer: "Praias de areia" },
                    { name: "🐋", question: "Maior animal que já existiu no planeta Terra?", correctAnswer: "Baleia-azul" },
                    { name: "🦑", question: "Cefalópode que possui três corações e sangue de cor azulada?", correctAnswer: "Polvo" }
                ],
                answers: ["Praias de areia", "Baleia-azul", "Polvo", "Recife de coral", "Zona abissal", "Estuário"]
            },
            {
                title: "Etapa 4: Ameaças aos Oceanos",
                students: [
                    { name: "🪸", question: "Principal causa do branqueamento dos corais nos últimos anos?", correctAnswer: "Aquecimento das águas" },
                    { name: "🗑️", question: "Material que representa a maior ameaça à vida marinha atualmente?", correctAnswer: "Plástico" },
                    { name: "⚓", question: "Atividade humana que causa danos físicos aos fundos marinhos e corais?", correctAnswer: "Ancoragem de navios" }
                ],
                answers: ["Aquecimento das águas", "Plástico", "Ancoragem de navios", "Pesca sustentável", "Recifes artificiais", "Turismo ecológico"]
            },
            {
                title: "Etapa 5: Comportamento Animal",
                students: [
                    { name: "🐬", question: "Método que golfinhos e baleias usam para se orientar e caçar através de sons?", correctAnswer: "Ecolocalização" },
                    { name: "🦀", question: "Motivo principal pelo qual o caranguejo-eremita troca de concha periodicamente?", correctAnswer: "Crescimento" },
                    { name: "🐙", question: "Mecanismo de defesa do polvo que envolve liberar uma nuvem escura na água?", correctAnswer: "Jato de tinta" }
                ],
                answers: ["Ecolocalização", "Crescimento", "Jato de tinta", "Migração", "Hibernação", "Fotossíntese"]
            },
            {
                title: "Etapa 6: Conservação Marinha",
                students: [
                    { name: "🌍", question: "Áreas marinhas legalmente protegidas para preservação da biodiversidade?", correctAnswer: "Unidades de Conservação Marinhas" },
                    { name: "🎣", question: "Tipo de pesca que respeita tamanhos mínimos e períodos de defeso?", correctAnswer: "Sustentável" },
                    { name: "♻️", question: "Princípio ambiental que completa: Reduzir, Reutilizar e...?", correctAnswer: "Reciclar" }
                ],
                answers: ["Unidades de Conservação Marinhas", "Sustentável", "Reciclar", "Exploração", "Poluição", "Extinção"]
            }
        ];

        this.currentLessonIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.audioContext = null;
        this.sounds = {};

        // Elementos do DOM
        this.studentsContainer = document.getElementById('students');
        this.answersContainer = document.getElementById('answers');
        this.scoreElement = document.getElementById('score');
        this.nextLevelScreen = document.getElementById('nextLevel');
        this.nextBtn = document.getElementById('nextBtn');
        this.starsContainer = document.getElementById('stars');
        this.confettiContainer = document.getElementById('confetti');
        this.bubblesContainer = document.getElementById('bubbles');

        this.init();
    }

    async init() {
        this.createBubbles();
        this.createSeaweed();
        await this.initAudio();
        this.startLesson(0);
    
        // novo: listener assíncrono que espera o envio da pontuação antes de avançar
        this.nextBtn.addEventListener('click', async () => {
            // protege caso botão não exista
            if (!this.nextBtn) return;
            // chama nextLesson (agora async)
            await this.nextLesson();
        });
    }
    

    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Sons simples gerados por oscilador
            this.sounds = {
                drag: this.createOscillatorSound(440, 0.1, 0.1),
                correct: this.createOscillatorSound(880, 0.2, 0.2),
                levelUp: this.createOscillatorSound(660, 0.3, 0.3)
            };
        } catch (e) {
            console.log("Áudio não disponível ou bloqueado:", e);
            // Continua sem áudio
        }
    }

    createOscillatorSound(frequency, duration, volume) {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            gainNode.gain.value = volume;
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
            }, duration * 1000);
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    createBubbles() {
        for (let i = 0; i < 35; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            const size = Math.random() * 20 + 6;
            const posX = Math.random() * 100;
            const duration = Math.random() * 10 + 8;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.6 + 0.2;
            
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${posX}%`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.animationDelay = `${delay}s`;
            bubble.style.opacity = opacity.toString();
            
            this.bubblesContainer.appendChild(bubble);
        }
    }

    createSeaweed() {
        const seaweeds = document.querySelectorAll('.seaweed');
        seaweeds.forEach((seaweed, index) => {
            seaweed.style.setProperty('--i', index);
            seaweed.style.left = `${15 + index * 20}%`;
        });
    }

    startLesson(lessonIndex) {
        const lesson = this.lessons[lessonIndex];
        document.querySelector('.game-title').textContent = `🃏 ${lesson.title}`;
        
        this.studentsContainer.innerHTML = '';
        this.answersContainer.innerHTML = '';
        this.correctAnswers = 0;

        // Criar peixinhos (alunos)
        lesson.students.forEach((student, index) => {
            const studentDiv = document.createElement('div');
            studentDiv.classList.add('student');
            studentDiv.dataset.index = index;
            studentDiv.dataset.correctAnswer = student.correctAnswer;
            studentDiv.tabIndex = 0; // Acessibilidade
            
            studentDiv.innerHTML = `
                <div class="fish-icon">${student.name}</div>
                <div class="question">${student.question}</div>
                <div class="drop-zone" data-student-index="${index}" role="region" aria-label="Zona para resposta da pergunta ${index + 1}">Arraste aqui</div>
            `;
            
            this.studentsContainer.appendChild(studentDiv);
        });

        // Criar cartões de resposta (embaralhados)
        const shuffledAnswers = [...lesson.answers].sort(() => Math.random() - 0.5);
        
        shuffledAnswers.forEach(answer => {
            const answerCard = document.createElement('div');
            answerCard.classList.add('answer-card');
            answerCard.textContent = answer;
            answerCard.draggable = true;
            answerCard.tabIndex = 0; // Acessibilidade
            answerCard.setAttribute('role', 'button');
            answerCard.setAttribute('aria-label', `Cartão com a resposta: ${answer}`);
            
            // Eventos de drag
            answerCard.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', answer);
                answerCard.classList.add('dragging');
                this.playSound('drag');
            });
            
            answerCard.addEventListener('dragend', () => {
                answerCard.classList.remove('dragging');
            });
            
            // Suporte para toque (mobile)
            let touchStartX = 0;
            let touchStartY = 0;
            
            answerCard.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                answerCard.classList.add('dragging');
                this.playSound('drag');
            });
            
            answerCard.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                
                // Simula movimento de arrastar
                answerCard.style.position = 'fixed';
                answerCard.style.zIndex = '1000';
                answerCard.style.left = `${touchX - answerCard.offsetWidth / 2}px`;
                answerCard.style.top = `${touchY - answerCard.offsetHeight / 2}px`;
            });
            
            answerCard.addEventListener('touchend', (e) => {
                answerCard.classList.remove('dragging');
                answerCard.style.position = '';
                answerCard.style.zIndex = '';
                answerCard.style.left = '';
                answerCard.style.top = '';
                
                // Verifica se foi solto em cima de uma zona de drop
                const touchX = e.changedTouches[0].clientX;
                const touchY = e.changedTouches[0].clientY;
                
                const dropZones = document.querySelectorAll('.drop-zone');
                for (let zone of dropZones) {
                    const rect = zone.getBoundingClientRect();
                    if (
                        touchX >= rect.left &&
                        touchX <= rect.right &&
                        touchY >= rect.top &&
                        touchY <= rect.bottom
                    ) {
                        this.handleDrop(zone, answer);
                        break;
                    }
                }
            });
            
            this.answersContainer.appendChild(answerCard);
        });

        // Configurar zonas de drop
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.style.backgroundColor = 'rgba(100, 255, 255, 0.3)';
                zone.style.borderColor = 'rgba(100, 255, 255, 0.8)';
            });
            
            zone.addEventListener('dragleave', () => {
                zone.style.backgroundColor = '';
                zone.style.borderColor = '';
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                this.handleDrop(zone, e.dataTransfer.getData('text/plain'));
            });
        });
    }

    handleDrop(zone, answer) {
        zone.style.backgroundColor = '';
        zone.style.borderColor = '';
        
        const studentIndex = zone.dataset.studentIndex;
        const studentDiv = document.querySelector(`.student[data-index="${studentIndex}"]`);
        const correctAnswer = studentDiv.dataset.correctAnswer;
        
        if (answer === correctAnswer) {
            // Acertou!
            zone.innerHTML = `✅ <strong>${answer}</strong>`;
            zone.style.backgroundColor = 'rgba(80, 227, 194, 0.3)';
            zone.style.color = '#ffffff';
            zone.style.fontWeight = 'bold';
            zone.style.borderColor = 'rgba(80, 227, 194, 0.5)';
            
            this.correctAnswers++;
            this.score += 10;
            this.scoreElement.textContent = this.score; // CORRETO



            
            // Efeito de confete
            this.createConfetti();
            this.playSound('correct');
            
            // Se acertou todos, mostra próxima etapa
            if (this.correctAnswers === this.lessons[this.currentLessonIndex].students.length) {
                setTimeout(() => {
                    this.showNextLevel();
                }, 1000);
            }
        } else {
            // Errou
            zone.innerHTML = `❌ <strong>${answer}</strong>`;
            zone.style.backgroundColor = 'rgba(255, 85, 85, 0.3)';
            zone.style.color = '#ffffff';
            zone.style.fontWeight = 'bold';
            zone.style.borderColor = 'rgba(255, 85, 85, 0.5)';
            
            // Deixa tentar de novo
            setTimeout(() => {
                zone.innerHTML = 'Arraste aqui';
                zone.style.backgroundColor = '';
                zone.style.color = '';
                zone.style.fontWeight = '';
                zone.style.borderColor = '';
            }, 2000);
        }
    }

    createConfetti() {
        this.confettiContainer.innerHTML = '';
        for (let i = 0; i < 70; i++) {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');
            
            const size = Math.random() * 6 + 4;
            const posX = Math.random() * 100;
            const duration = Math.random() * 2 + 1;
            const rotation = Math.random() * 360;
            const colors = ['#ffdd57', '#50e3c2', '#ff5555', '#00aaff', '#ff9933'];
            
            piece.style.width = `${size}px`;
            piece.style.height = `${size}px`;
            piece.style.left = `${posX}%`;
            piece.style.animationDuration = `${duration}s`;
            piece.style.transform = `rotate(${rotation}deg)`;
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            this.confettiContainer.appendChild(piece);
            
            // Remove após animação
            setTimeout(() => {
                piece.remove();
            }, 3000);
        }
    }

    showNextLevel() {
        // Calcula estrelas (3 estrelas = tudo certo na primeira tentativa)
        // Como não temos sistema de tentativas, damos 3 estrelas sempre
        this.starsContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.classList.add('star', 'filled');
            star.innerHTML = '★';
            this.starsContainer.appendChild(star);
        }
        
        this.nextLevelScreen.style.display = 'flex';
        this.playSound('levelUp');
    }

    // avança de etapa E envia a pontuação ao backend antes de carregar a próxima
    // avança de etapa E envia a pontuação ao backend antes de carregar a próxima
async nextLesson() {
    try {
        // desativa botão para evitar múltiplos cliques
        this.nextBtn.disabled = true;

        // envia pontuação para o backend
        const payload = {
            playerName: localStorage.getItem("usuario"), // nome exato esperado pelo backend
            score: this.score // pontuação
        };
        

        if (!payload.playerName || isNaN(payload.score)) {
            console.error("Payload inválido:", payload);
            this.nextBtn.disabled = false;
            return;
        }

        console.log("Enviando payload:", payload);

        const response = await fetch("https://app-n5wahuji6a-uc.a.run.app/api/salvar-pontuacao", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            mode: "cors"
        });

        const data = await response.json();
        console.log("Resposta backend:", data);

        // vai para a próxima etapa
        this.currentLessonIndex++;

        if (this.currentLessonIndex < this.lessons.length) {
            this.nextLevelScreen.style.display = 'none';
            this.starsContainer.innerHTML = '';
            this.confettiContainer.innerHTML = '';
            this.nextBtn.disabled = false;
            this.startLesson(this.currentLessonIndex);
            return;
        }

        // Fim do jogo
        this.nextLevelScreen.innerHTML = `
            <h2>🎓 PARABÉNS, VOCÊ COMPLETOU TODAS AS ETAPAS!</h2>
            <p>Pontuação final: <strong>${this.score}</strong> pontos</p>
            <button id="restartBtn" class="btn btn-primary">Jogar Novamente</button>
            <a href="ranking.html" class="btn" style="margin-top: 10px;">Ver Ranking</a>
        `;
        this.nextLevelScreen.style.display = "flex";

        const restart = document.getElementById("restartBtn");
        if (restart) restart.addEventListener("click", () => location.reload());

    } catch (e) {
        console.error("Erro em nextLesson:", e);
        alert("Não foi possível salvar sua pontuação. Tente novamente.");
        this.nextBtn.disabled = false;
    }
    
}
}

// Inicializa o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    new MarineCardGame();
});