const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreVal');
const highScoreElement = document.getElementById('highScoreVal');
const overlay = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMsg = document.getElementById('overlay-msg');
const restartBtn = document.getElementById('restart-btn');

// Result Popup Elements
const resultPopup = document.getElementById('result-popup');
const resultScore = document.getElementById('result-score');
const resultBest = document.getElementById('best-score');
const resultRank = document.getElementById('result-rank');
const playAgainBtn = document.getElementById('play-again-btn');
const dashboardBtn = document.getElementById('dashboard-btn');

// Game State
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let dx = 0;
let dy = 0;
let paused = false;
let gameActive = true;

let snake = [
    {x: 10, y: 10},
    {x: 10, y: 11},
    {x: 10, y: 12}
];
let food = {x: 5, y: 5};

highScoreElement.innerText = highScore;

function main() {
    if (!gameActive) return;

    if (paused) {
        requestAnimationFrame(main);
        return;
    }

    if (didGameEnd()) {
        gameOver();
        return;
    }

    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();

    requestAnimationFrame(gameLoop);
}

let lastTime = 0;
const gameSpeed = 100; // ms

function gameLoop(timestamp) {
    if (!gameActive) return;
    if (paused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    if (timestamp - lastTime >= gameSpeed) {
        main();
        lastTime = timestamp;
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = '#00f2ff';
    snake.forEach((part, index) => {
        if (index === 0) ctx.fillStyle = '#fff';
        else ctx.fillStyle = '#00f2ff';
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function advanceSnake() {
    if (dx === 0 && dy === 0) return;

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        createFood();
    } else {
        snake.pop();
    }
}

function didGameEnd() {
    if (dx === 0 && dy === 0) return false;
    const head = snake[0];
    const hitWall = head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
    let hitSelf = false;
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            hitSelf = true;
            break;
        }
    }
    return hitWall || hitSelf;
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    if (snake.some(part => part.x === food.x && part.y === food.y)) {
        createFood();
    }
}

function drawFood() {
    ctx.fillStyle = '#ff0055';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function togglePause() {
    paused = !paused;
    overlay.classList.toggle('active', paused);
    overlayTitle.innerText = "PAUSED";
    overlayMsg.innerText = "Press SPACE to Resume";
}

async function gameOver() {
    gameActive = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.innerText = highScore;
    }

    // Send score to parent dashboard
    window.parent.postMessage({
        type: 'GAME_SCORE_SUBMIT',
        data: {
            gameName: 'snake',
            score: score
        }
    }, '*');

    // Show animated popup
    resultScore.innerText = score;
    resultBest.innerText = highScore;
    resultRank.innerText = 'Calculating...';

    resultPopup.style.display = 'flex';

    // We can't easily get rank back from parent unless parent replies,
    // but since the dashboard updates, the user will see it.
    // For now, let's just show a "Check Dashboard" message.
}

function restartGame() {
    score = 0;
    scoreElement.innerText = score;
    dx = 0;
    dy = 0;
    snake = [
        {x: 10, y: 10},
        {x: 10, y: 11},
        {x: 10, y: 12}
    ];
    gameActive = true;
    paused = false;
    resultPopup.style.display = 'none';
    overlay.classList.remove('active');
    createFood();
    requestAnimationFrame(gameLoop);
}

// Input Handling
function handleKeyDown(e) {
    if (e.code === 'Space') {
        togglePause();
        return;
    }

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (e.key === 'ArrowLeft' && !goingRight) { dx = -1; dy = 0; }
    if (e.key === 'ArrowUp' && !goingDown) { dx = 0; dy = -1; }
    if (e.key === 'ArrowRight' && !goingLeft) { dx = 1; dy = 0; }
    if (e.key === 'ArrowDown' && !goingUp) { dx = 0; dy = 1; }
}

window.addEventListener('keydown', handleKeyDown);
restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', restartGame);
dashboardBtn.addEventListener('click', () => {
    window.parent.postMessage({ type: 'CLOSE_MODAL' }, '*');
    resultPopup.style.display = 'none';
});

// Mobile Controls
document.getElementById('up-btn').addEventListener('click', () => { if(dy !== 1) { dx = 0; dy = -1; }});
document.getElementById('down-btn').addEventListener('click', () => { if(dy !== -1) { dx = 0; dy = 1; }});
document.getElementById('left-btn').addEventListener('click', () => { if(dx !== 1) { dx = -1; dy = 0; }});
document.getElementById('right-btn').addEventListener('click', () => { if(dx !== -1) { dx = 1; dy = 0; }});

createFood();
requestAnimationFrame(gameLoop);
