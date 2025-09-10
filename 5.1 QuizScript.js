const questions = [
    {
        question: "Qual ramo da Biologia se dedica ao estudo de Organismos Marinhos?",
        answers: [
            { id: 1, text: "Oceanografia Química", correct:false},
            { id: 2, text: "Ecologia Molecular", correct:false},
            { id: 3, text: "Biologia Marinha", correct:true},
            { id: 4, text: "Limnologia", correct:false},
        ],
    },
    {
        question: "Qual o maior mamífero que habita o Mar?",
        answers: [
            { id: 1, text: "Baleia Azul", correct:true},
            { id: 2, text: "Tubarão Branco", correct:false},
            { id: 3, text: "Tubarão Baleia", correct:false},
            { id: 4, text: "Baleia Cachalotte", correct:false},
        ],
    },
    {
        question: "Qual o animal marinho que nada mais rápido?",
        answers: [
            { id: 1, text: "Tubarão Branco", correct:false},
            { id: 2, text: "Peixe Espada", correct:false},
            { id: 3, text: "Golfinho", correct:false},
            { id: 4, text: "Peixe agulhão-vela", correct:true},
        ],
    },
    {
        question: "Qual o principal alimento dos tubarões brancos?",
        answers: [
            { id: 1, text: "Focas/Leões marinhos", correct:false},
            { id: 2, text: "Carcaças de Baleia", correct:false},
            { id: 3, text: "Peixes", correct:false},
            { id: 4, text: "Todas as opções acima", correct:true},
        ],
    },
    {
        question: "O que é o plâncton?",
        answers: [
            { id: 1, text: "Peixe de águas rasas", correct:false},
            { id: 2, text: "Algas gigantes", correct:false},
            { id: 3, text: "Microrganismos marinhos", correct:true},
            { id: 4, text: " Fragmentos de detritos", correct:false},
        ],
    },
    {
        question: "Qual é a função das barbatanas nos peixes?",
        answers: [
            { id: 1, text: "Locomoção, equilíbrio e direção", correct:true},
            { id: 2, text: " Arma de defesa ", correct:false},
            { id: 3, text: "Aquecer o corpo em águas frias", correct:false},
            { id: 4, text: " Todas as opções acima ", correct:false},
        ],
    },
]

const questionElement = document.getElementById("question");
const botaoResposta = document.getElementById("botao-resposta");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Próxima"
    showQuestion();
}

function resetState() {
    nextButton.style.display = "none";
    while (botaoResposta.firstChild) {
        botaoResposta.removeChild(botaoResposta.firstChild);
    }
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.dataset.id = answer.id;
        button.classList.add("btn");
        button.addEventListener("click", selectAnswer);
        botaoResposta.appendChild(button);
        
    });
}

function selectAnswer(e) {
    answers = questions[currentQuestionIndex].answers;
    const correctAnswer = answers.filter((answer) => answer.correct === true)[0];

    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.id == correctAnswer.id;
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(botaoResposta.children).forEach((button) => {
        button.disabled = true;
    });
    nextButton.style.display = "block";

} 

function showScore(){
    resetState();
    questionElement.innerHTML = `Você acertou ${score} de ${questions.length}!`;
    nextButton.innerHTML = "Reiniciar";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
       handleNextButton();
    } else {
        startQuiz();
    }

});

startQuiz();