// static/flying_words.js
const container = document.getElementById('flying-letters-container');
const words = ['kızgın', 'üzgün', 'korku', 'iğrenme', 'mutlu', 'aşk', 'merak', 'utanç', 'şaşkınlık'];
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493', '#8a2be2', '#808080'];

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
