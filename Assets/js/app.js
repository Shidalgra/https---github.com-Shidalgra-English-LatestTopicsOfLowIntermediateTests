import { quizData } from './data.js';

let score = 0, streak = 0, currentQ, currentTopic, respondido = false;

// Esta función se expone al objeto window para que el HTML la encuentre
window.startQuiz = (topic) => {
    currentTopic = topic;
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    loadQuestion();
};

function loadQuestion() {
    const questions = quizData[currentTopic];
    const randomIndex = Math.floor(Math.random() * questions.length);
    const originalQ = questions[randomIndex];

    currentQ = { ...originalQ };
    currentQ.options = [...originalQ.options].sort(() => Math.random() - 0.5);

    const respuestaCorrectaTexto = originalQ.options[originalQ.correct];
    currentQ.correctIndex = currentQ.options.indexOf(respuestaCorrectaTexto);

    document.getElementById('question').innerText = currentQ.q;
    document.getElementById('hint-text').innerText = "Pista: " + currentQ.hint;
    document.getElementById('hint-text').style.display = 'none';
    document.getElementById('btn-next').style.display = 'none';
    respondido = false;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-opt';
        
        // AQUÍ ESTÁ EL CAMBIO: Usamos innerHTML para poner el texto y el icono
        btn.innerHTML = `
            <span>${opt}</span>
            <span class="btn-audio-icon" onclick="event.stopPropagation(); playWord('${opt}')">🔊</span>
        `;
        
        btn.onclick = () => checkAnswer(index, btn);
        optionsDiv.appendChild(btn);
    });
}

// Asegúrate de tener esta función fuera, en el ámbito global
window.playWord = (word) => {
    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = 'en-US';
    speech.rate = 0.8;
    window.speechSynthesis.speak(speech);
};

function checkAnswer(index, btn) {
    if (respondido) return; 
    respondido = true;

    if (index === currentQ.correctIndex) {
        score += 10;
        streak++;
        // AQUÍ USAMOS LA CLASE CSS
        btn.classList.add('correct'); 
    } else {
        streak = 0;
        // AQUÍ USAMOS LA CLASE CSS
        btn.classList.add('wrong'); 
        
        // Resaltar la correcta
        const buttons = document.querySelectorAll('.btn-opt');
        buttons[currentQ.correctIndex].classList.add('correct');
    }

    document.getElementById('score').innerText = score;
    document.getElementById('streak').innerText = streak;
    document.querySelectorAll('.btn-opt').forEach(b => b.disabled = true);
    document.getElementById('btn-next').style.display = 'block';
}

document.getElementById('btn-next').onclick = loadQuestion;

document.getElementById('btn-audio').onclick = () => {
    if (!currentQ) return;
    const speech = new SpeechSynthesisUtterance(currentQ.q);
    speech.lang = 'en-US';
    speech.rate = 0.9;

    // Buscar una voz en inglés (si existe en el sistema)
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en-US'));
    if (englishVoice) speech.voice = englishVoice;

    window.speechSynthesis.speak(speech);
};

document.getElementById('btn-show-hint').onclick = () => {
    document.getElementById('hint-text').style.display = 'block';
};