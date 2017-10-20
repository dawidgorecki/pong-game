const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 900;
canvas.height = 500;

const cw = canvas.width;
const ch = canvas.height;
const tableColor = "#222222";

// linia środkowa
const lineWidth = 4;
const lineHeight = 10;
const lineSpace = 5;
const lineColor = "#444444";

// piłka
const ballColor = "#f2f2f2";
const ballSize = 20;
let ballSpeedX = -3.0;
let ballSpeedY = getRndInteger(1, 3);
let ballX = cw / 2 - ballSize / 2;
let ballY = ch / 2 - ballSize / 2;

// gracz
const playerColor = "#f2f2f2";
const playerWidth = 20;
const playerHeight = 100;
const playerX = 60;
let playerY = 200;

// AI
const aiColor = "#f2f2f2";
const aiX = cw - playerX - playerWidth;
let aiY = 200;

// punktacja
const maxScore = 5;
let playerScore = 0;
let aiScore = 0;

// kolor tekstu
const fontColor = "#f2f2f2";

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTable() {
    ctx.fillStyle = tableColor;
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = lineColor;

    // narysuj linie środkową
    for (let lineY = lineSpace; lineY < ch; lineY += lineSpace + lineHeight) {
        ctx.fillRect(cw / 2 - lineWidth / 2, lineY, lineWidth, lineHeight);
    }
    ctx.font = "15px Arial";
    ctx.fillStyle = fontColor;
    ctx.textAlign = "center";
    ctx.fillText("v1.0.0", cw - 30, ch - 15);
}

function createPlayer() {
    ctx.fillStyle = playerColor;
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function createAi() {
    ctx.fillStyle = aiColor;
    ctx.fillRect(aiX, aiY, playerWidth, playerHeight);
}

function createBall() {
    ctx.fillStyle = ballColor;
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // odbicie od górnej i dolnej krawędzi
    if (ballY <= 0 || ballY + ballSize >= ch) {
        ballSpeedY = -ballSpeedY;
        speedUp();
    }

    const playerPaddleTop = playerY;
    const playerPaddleBottom = playerY + playerHeight;
    const aiPaddleTop = aiY;
    const aiPaddleBottom = aiY + playerHeight;

    const onPlayerPaddle = ballY + ballSize > playerPaddleTop && ballY < playerPaddleBottom && ballX > playerX;
    const onAiPaddle = ballY + ballSize > aiPaddleTop && ballY < aiPaddleBottom && ballX < aiX + playerWidth;

    if (ballX < playerX + playerWidth && onPlayerPaddle == true) {
        ballX = playerX + playerWidth;
        ballSpeedX = -ballSpeedX;
        speedUp();
    }

    if (ballX + ballSize > aiX && onAiPaddle == true) {
        ballX = aiX - ballSize;
        ballSpeedX = -ballSpeedX;
        speedUp();
    }

    // naliczanie punktów
    if (ballX <= 0) {
        aiScore += 1;
        resetBall();
    } else if (ballX + ballSize >= cw) {
        playerScore += 1;
        resetBall();
    }
}

function resetBall() {
    ballX = cw / 2 - ballSize / 2;
    ballY = ch / 2 - ballSize / 2;

    ballSpeedX = 3.0;
    ballSpeedY = getRndInteger(1, 3);

    const ballDirection = getRndInteger(1, 2);

    if (ballDirection == 1) {
        ballSpeedY = -ballSpeedY;
        ballSpeedX = -ballSpeedX;
    }
}

function speedUp() {
    if (ballSpeedX > 0 && ballSpeedX < 15) {
        ballSpeedX += 0.2;
    } else if (ballSpeedX < 0 && ballSpeedX > -15) {
        ballSpeedX -= 0.2;
    }

    if (ballSpeedY > 0 && ballSpeedY < 15) {
        ballSpeedY += 0.2;
    } else if (ballSpeedY < 0 && ballSpeedY > -15) {
        ballSpeedY -= 0.2;
    }
}

function playerPosition(e) {
    playerY = e.clientY - canvas.offsetTop - playerHeight / 2;

    if (playerY <= 0) {
        playerY = 0;
    }

    if (playerY >= ch - playerHeight) {
        playerY = ch - playerHeight;
    }
}

function aiPosition() {
    const ballPosition = ballY + ballSize / 2;
    const aiPosition = aiY + playerHeight / 2;

    if (ballX > cw / 2) {
        // piłka na połowie AI
        if (aiPosition - ballPosition > 200) {
            aiY -= 20;
        } else if (aiPosition - ballPosition > 50) {
            aiY -= 8;
        } else if (aiPosition - ballPosition < -200) {
            aiY += 20;
        } else if (aiPosition - ballPosition < -50) {
            aiY += 8;
        }
    } else if (ballX <= cw / 2 && ballX > 150) {
        // piłka na połowie gracza
        if (aiPosition - ballPosition > 100) {
            aiY -= 4;
        } else if (aiPosition - ballPosition < -100) {
            aiY += 4;
        }
    }
}

function showScore() {
    ctx.font = "50px Arial";
    ctx.fillStyle = fontColor;
    ctx.textAlign = "center";
    ctx.fillText(playerScore + "    " + aiScore, cw / 2, 70);
}

function endGame() {
    ctx.font = "40px Arial";
    ctx.fillStyle = fontColor;
    ctx.textAlign = "center";

    if (aiScore == maxScore) {
        ctx.fillText("PRZEGRAŁEŚ", cw / 4 * 3, ch / 2);
    } else {
        ctx.fillText("WYGRAŁEŚ", cw / 4, ch / 2);
    }
}

function startGame() {
    if (playerScore >= maxScore || aiScore >= maxScore) {
        createTable();
        showScore();
        endGame();
    } else {
        createTable();
        showScore();
        createBall();
        createPlayer();
        createAi();
        aiPosition();
    }
}

canvas.addEventListener("mousemove", playerPosition);
setInterval(startGame, 1000 / 60);
