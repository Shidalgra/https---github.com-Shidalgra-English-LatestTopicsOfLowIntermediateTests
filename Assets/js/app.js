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

    // 1. Clonamos la pregunta para no modificar los datos originales
    currentQ = { ...originalQ };

    // 2. Mezclamos las opciones de forma simple
    // Esto crea un nuevo orden cada vez sin bucles pesados
    currentQ.options = [...originalQ.options].sort(() => Math.random() - 0.5);

    // 3. Identificamos cuál es la nueva posición de la respuesta correcta
    const respuestaCorrectaTexto = originalQ.options[originalQ.correct];
    currentQ.correctIndex = currentQ.options.indexOf(respuestaCorrectaTexto);

    // Renderizado
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
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, btn);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(index, btn) {
    if (respondido) return; // Evita que se sumen puntos doble
    respondido = true;

    // Verificamos contra currentQ.correctIndex (el que calculamos al mezclar)
    if (index === currentQ.correctIndex) {
        score += 10;
        streak++;
        btn.style.backgroundColor = '#d4edda'; // Color verde suave
        btn.style.border = '2px solid #28a745';
    } else {
        streak = 0; // Se rompe la racha
        btn.style.backgroundColor = '#f8d7da'; // Color rojo suave
        btn.style.border = '2px solid #dc3545';
        
        // Opcional: Resaltar cuál era la correcta
        const buttons = document.querySelectorAll('.btn-opt');
        buttons[currentQ.correctIndex].style.backgroundColor = '#d4edda';
    }

    // Actualizamos el DOM (esto es lo que hace que veas el cambio en pantalla)
    document.getElementById('score').innerText = score;
    document.getElementById('streak').innerText = streak;

    // Deshabilitamos todos los botones para que no sigan haciendo click
    document.querySelectorAll('.btn-opt').forEach(b => b.disabled = true);
    
    // Mostramos el botón siguiente
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