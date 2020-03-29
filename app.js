const word = document.querySelector('#word')
const text = document.querySelector('#text')
const scoreEl = document.querySelector('#score')
const timeEl = document.querySelector('#time')
const endgameEl = document.querySelector('#end-game-container')
const settingsBtn = document.querySelector('#settings-btn')
const settings = document.querySelector('#settings')
const settingsForm = document.querySelector('#settings-form')
const difficultySelect = document.querySelector('#difficulty');

// init current word
let currentWord;

// init score
let score = 0;
// init time 
let time = 10;
// init difficulty
let difficulty = localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'easy';

// set difficulty DOM 
difficultySelect.value = localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'easy';
// focus on text
text.focus();

// fetch random word
async function getRandomWord() {
    const randomWord = await fetch(`https://random-word-api.herokuapp.com/word?number=1`);
    const res = await randomWord.json();
    return res
}

// update DOM
async function addWordToDOM() {
    currentWord = await getRandomWord();
    word.innerHTML = currentWord;
}
addWordToDOM();

// updateScore
function updateScore() {
    if (difficulty === 'easy') {
        score++;
    } else if (difficulty === 'medium') {
        score += 2;
    } else if (difficulty === 'hard') {
        score += 3;
    }

    scoreEl.innerHTML = score;
}

// timer
const timeInterval = setInterval(updateTime, 1000);

function updateTime() {
    time--;
    timeEl.innerHTML = time + 's';

    if (time === 0) {
        clearInterval(timeInterval);
        gameOver();
    }
}

// gameover, endscreen
function gameOver() {
    endgameEl.innerHTML = `
    <h1>Time ran out</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Play Again</button>
    `;

    endgameEl.style.display = 'flex'
}

text.addEventListener('input', e => {
    const insertedText = e.target.value;
    if (insertedText.toLowerCase() == currentWord) {
        e.target.value = '';
        addWordToDOM();
        updateScore();

        if (difficulty === 'easy') {
            time += 4;
        } else if (difficulty === 'medium') {
            time += 3;
        } else if (difficulty === 'hard') {
            time += 2;
        }
        updateTime();
    }
});

// show/hide difficulty
settingsBtn.addEventListener('click', () => {
    settings.classList.toggle('hide')
})

// settings select
settingsForm.addEventListener('change', e => {
    difficulty = e.target.value;
    localStorage.setItem('difficulty', difficulty)
})
