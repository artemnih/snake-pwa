const canvas = document.getElementById('tutorial');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const interval = 400; // ms // todo: add levels
const maxX = 10;
const maxY = 10;
const size = ctx.canvas.width / maxX;
const innerMargin = 10;
const innerSize = size - innerMargin;

const buttonFactor = 5;
const buttonMargin = 10;
const buttonSize = ctx.canvas.width / buttonFactor;

const gameViewWidth = maxX * size;
const gameViewHeight = maxY * size;
const midWidth = gameViewWidth / 2;

const buttons = {
    up: { x: midWidth - buttonSize / 2, y: gameViewHeight + buttonMargin },
    down: { x: midWidth - buttonSize / 2, y: gameViewHeight + buttonMargin * 3 + buttonSize * 2 },
    left: { x: midWidth - buttonSize / 2 - buttonMargin - buttonSize, y: gameViewHeight + buttonMargin * 2 + buttonSize },
    right: { x: midWidth - buttonSize / 2 + buttonMargin + buttonSize, y: gameViewHeight + buttonMargin * 2 + buttonSize },
}

const direction = {
    up: 'up',
    down: 'down',
    right: 'right',
    left: 'left'
}

const snake = [
    { x: 6, y: 5 },
    { x: 5, y: 5 },
    { x: 4, y: 5 },
]
const food = { x: 0, y: 0 };

let currentDirection = direction.right;
let keydown = "";
let run = true;



function drawControls() {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, gameViewHeight, gameViewWidth, 1);

    ctx.fillStyle = 'rgba(100, 100, 100, 1)';
    for (const key in buttons) {
        const button = buttons[key];
        ctx.fillRect(button.x, button.y, buttonSize, buttonSize);
    }
}

function draw({ x, y }, isFood = false) {
    ctx.fillStyle = 'rgba(100, 100, 100, 1)';
    ctx.fillRect(x * size, y * size, size, size);
    ctx.fillStyle = isFood ? 'rgba(200, 200, 200, 1)' : 'rgba(80, 80, 80, 1)';
    ctx.fillRect(x * size + (size - innerSize) / 2, y * size + (size - innerSize) / 2, innerSize, innerSize);
}

function clear() {
    ctx.clearRect(0, 0, maxX * size, maxY * size);
}

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return;
    }
    keydown = event.code;
    event.preventDefault();
}, true);

canvas.addEventListener('click', function (e) {
    const x = e.offsetX;
    const y = e.offsetY;
    for (const key in buttons) {
        const button = buttons[key];
        if (x > button.x && x < (button.x + buttonSize) && y > button.y && y < (button.y + buttonSize)) {
            keydown = key;
        }
    }
}, false);


function changeDirection() {
    switch (keydown) {
        case "down":
        case "KeyS":
        case "ArrowDown":
            if (currentDirection !== direction.up) {
                currentDirection = direction.down;
            }
            break;
        case "up":
        case "KeyW":
        case "ArrowUp":
            if (currentDirection !== direction.down) {
                currentDirection = direction.up;
            }
            break;
        case "left":
        case "KeyA":
        case "ArrowLeft":
            if (currentDirection !== direction.right) {
                currentDirection = direction.left;
            }
            break;
        case "right":
        case "KeyD":
        case "ArrowRight":
            if (currentDirection !== direction.left) {
                currentDirection = direction.right;
            }
            break;
    }
}

function replaceFood() {
    let found = true;
    let x, y;

    while (found) {
        x = Math.round(Math.random() * (maxX - 1));
        y = Math.round(Math.random() * (maxY - 1));
        found = snake.some(piece => piece.x === x && piece.y === y);
    }
    food.x = x;
    food.y = y;
}
function check() {
    const head = snake[0];
    for (let i = 2; i < snake.length; i++) {
        const piece = snake[i];
        if (head.x === piece.x && head.y === piece.y) {
            return true;
        }
    }
    return false;
}

function process() {
    const endPiece = snake.pop();
    const headPiece = snake[0];

    const oldX = endPiece.x;
    const oldY = endPiece.y;

    if (currentDirection === direction.up) {
        endPiece.y = headPiece.y - 1;
        endPiece.x = headPiece.x;
        if (endPiece.y < 0) {
            endPiece.y = maxY - 1;
        }
    }

    if (currentDirection === direction.down) {
        endPiece.x = headPiece.x;
        endPiece.y = headPiece.y + 1;
        if (endPiece.y > maxY - 1) {
            endPiece.y = 0;
        }
    }

    if (currentDirection === direction.left) {
        endPiece.y = headPiece.y;
        endPiece.x = headPiece.x - 1;
        if (endPiece.x < 0) {
            endPiece.x = maxX - 1;
        }
    }

    if (currentDirection === direction.right) {
        endPiece.y = headPiece.y;
        endPiece.x = headPiece.x + 1;
        if (endPiece.x > maxX - 1) {
            endPiece.x = 0;
        }
    }
    snake.unshift(endPiece);

    if (check()) {
        run = false;
        alert('GAME OVER');
    }

    if (endPiece.x === food.x && endPiece.y === food.y) {
        snake.push({ x: oldX, y: oldY });
        replaceFood();
    }
}

drawControls();
replaceFood();
setInterval(() => {
    if (run) {
        clear();
        changeDirection();
        process();
        snake.forEach(s => draw(s));
        draw(food, true);
    }
}, interval)
