// static/game_script.js
let totalScore = localStorage.getItem('totalScore') ? parseInt(localStorage.getItem('totalScore')) : 0;
const form = document.getElementById('game-form');
const nextBtn = document.getElementById('next-btn');
const homeBtn = document.getElementById('home-btn');
const resultsContainer = document.getElementById('results');
const totalScoreElement = document.getElementById('total-score');

totalScoreElement.textContent = totalScore;

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    fetch('/game/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        resultsContainer.innerHTML = '<h2>Tahmin Edilen Duygular:</h2>';

        const sortedPredictions = Object.entries(data.predictions).sort((a, b) => b[1] - a[1]);
        const ul = document.createElement('ul');
        for (const [emotion, probability] of sortedPredictions) {
            const li = document.createElement('li');
            li.textContent = `${emotion}: ${(probability * 100).toFixed(2)}%`;
            ul.appendChild(li);
        }
        resultsContainer.appendChild(ul);

        resultsContainer.innerHTML += `<p>En Yüksek Duygu: ${data.top_emotion}</p>`;
        resultsContainer.innerHTML += `<p>Kazandığınız Puan: ${data.score}</p>`;
        totalScore += data.score;
        localStorage.setItem('totalScore', totalScore);
        totalScoreElement.textContent = totalScore;

        resultsContainer.style.display = 'block';
        nextBtn.style.display = 'block';
    })
    .catch(error => console.error('Error:', error));
});


homeBtn.addEventListener('click', function() {
    window.location.href = '/';
});

nextBtn.addEventListener('click', function() {
    fetch('/game/next')
        .then(response => response.json())
        .then(data => {
            document.getElementById('random-emotion').textContent = data.emotion;
            document.getElementById('target_emotion').value = data.emotion;
            document.getElementById('input_text').value = '';
            resultsContainer.style.display = 'none';
            nextBtn.style.display = 'none';
        })
        .catch(error => console.error('Error:', error));
});
