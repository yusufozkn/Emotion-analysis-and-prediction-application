// static/script.js
const container = document.getElementById('flying-letters-container');
const words = ['kızgın', 'üzgün', 'korku', 'iğrenme', 'mutlu', 'aşk', 'merak', 'utanç', 'şaşkınlık'];
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493', '#8a2be2', '#808080'];

const emojiMap = {
    'kızgın': '😠',
    'şaşkınlık': '😲',
    'mutlu': '😃',
    'üzgün': '😢',
    'korku': '😱',
    'iğrenme': '🤢',
    'merak': '🤔',
    'aşk': '❤️',
    'utanç': '😳'
};

function createFlyingWord() {
    const word = document.createElement('span');
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    word.textContent = words[randomIndex];
    word.classList.add('flying-text');
    word.style.color = colors[randomColorIndex];

    const isRight = Math.random() < 0.5;
    const startPosition = isRight ? 70 + Math.random() * 20 : Math.random() * 20;
    word.style.left = `${startPosition}%`;
    word.style.top = `${Math.random() * 400 + 100}px`;

    container.appendChild(word);

    setTimeout(() => {
        word.remove();
    }, 5000);
}

setInterval(createFlyingWord, 1000);

const form = document.getElementById('predict-form');
const textarea = document.getElementById('input_text');

textarea.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
});

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '<h2>Tahmin Edilen Duygular:</h2>';

        const sortedPredictions = Object.entries(data.predictions).sort((a, b) => b[1] - a[1]);

        const ul = document.createElement('ul');
        for (const [emotion, probability] of sortedPredictions) {
            const li = document.createElement('li');
            li.textContent = `${emotion}: ${(probability * 100).toFixed(2)}%`;

            const emojiBar = document.createElement('div');
            emojiBar.classList.add('emoji-bar');
            const emojiCount = Math.round(probability * 10);  // Yüzdelik değeri emojilere çevir
            for (let i = 0; i < emojiCount; i++) {
                const emoji = document.createElement('span');
                emoji.textContent = emojiMap[emotion];  // Duyguya uygun emoji
                emojiBar.appendChild(emoji);
            }

            li.appendChild(emojiBar);
            ul.appendChild(li);
        }
        resultsContainer.appendChild(ul);
        resultsContainer.style.display = 'block'; // Sonuç kutusunu görünür hale getirme
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('game-btn').addEventListener('click', function() {
    window.location.href = '/game';
});
