const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
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

let score = 0;
let lives = 3;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 4;
const brickColumnCount = 6;
const brickWidth = 70;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 40;
const brickOffsetLeft = 20;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
    else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
    else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += 10;
                    scoreElement.innerText = score;
                    if (score === brickRowCount * brickColumnCount * 10) {
                        victory();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#00f2ff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#bc13fe';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            livesElement.innerText = lives;
            if (!lives) {
                gameOver();
            } else {
                resetBall();
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 3;
    dy = -3;
    paddleX = (canvas.width - paddleWidth) / 2;
}

function gameOver() {
    overlay.classList.add('active');
    overlayTitle.innerText = "GAME OVER";
    overlayMsg.innerText = `Final Score: ${score}`;
    handleGameEnd();
}

function victory() {
    overlay.classList.add('active');
    overlayTitle.innerText = "VICTORY!";
    overlayMsg.innerText = `Final Score: ${score}`;
    handleGameEnd();
}

async function handleGameEnd() {
    // Save high score locally for immediate display
    let highScore = localStorage.getItem('brickbreakerHighScore') || 0;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('brickbreakerHighScore', highScore);
    }

    // Send score to parent dashboard
    window.parent.postMessage({
        type: 'GAME_SCORE_SUBMIT',
        data: {
            gameName: 'brickbreaker',
            score: score
        }
    }, '*');

    // Show animated popup
    resultScore.innerText = score;
    resultBest.innerText = highScore;
    resultRank.innerText = 'Calculating...';
    resultPopup.style.display = 'flex';
}

function restartGame() {
    score = 0;
    lives = 3;
    scoreElement.innerText = score;
    livesElement.innerText = lives;
    resetBall();
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
    overlay.classList.remove('active');
    resultPopup.style.display = 'none';
    draw();
}

restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', restartGame);
dashboardBtn.addEventListener('click', () => {
    window.parent.postMessage({ type: 'CLOSE_MODAL' }, '*');
    resultPopup.style.display = 'none';
});

// Mobile Controls
document.getElementById('left-btn').addEventListener('click', () => { leftPressed = true; setTimeout(() => { leftPressed = false; }, 200); });
document.getElementById('right-btn').addEventListener('click', () => { rightPressed = true; setTimeout(() => { rightPressed = false; }, 200); });

draw();
