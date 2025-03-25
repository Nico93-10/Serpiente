const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

const boardSize = 10; 
// Velocidad en milisegundos
let gameSpeed = 400;
// Cantidad de reducción en cada comida
const speedIncrease = 100; 
// Velocidad mínima
const maxSpeed = 200; 

const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -boardSize,
    ArrowDown: boardSize,
    ArrowRight: 1,
    ArrowLeft: -1,
};

let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
};

const drawSquare = (square, type) => {
    const row = Math.floor(square / boardSize);
    const column = square % boardSize;
    
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        emptySquares = emptySquares.filter(sq => sq !== square);
    }
};

const moveSnake = () => {
    const newSquare = snake[snake.length - 1] + directions[direction];
    const row = Math.floor(newSquare / boardSize);
    const column = newSquare % boardSize;

    if (
        newSquare < 0 || 
        newSquare >= boardSize * boardSize || 
        (direction === 'ArrowRight' && column === 0) ||
        (direction === 'ArrowLeft' && column === boardSize - 1) ||
        boardSquares[row][column] === squareTypes.snakeSquare
    ) {
        gameOver();
        return;
    }

    snake.push(newSquare);

    if (boardSquares[row][column] === squareTypes.foodSquare) {
        addFood();
    } else {
    
        const emptySquare = snake.shift();
        drawSquare(emptySquare, 'emptySquare');
    }

    drawSnake();
};

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
};

const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval);
    startButton.disabled = false;
};

const setDirection = newDirection => {
    direction = newDirection;
};

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            if (direction !== 'ArrowDown') setDirection(key.code);
            break;
        case 'ArrowDown':
            if (direction !== 'ArrowUp') setDirection(key.code);
            break;
        case 'ArrowLeft':
            if (direction !== 'ArrowRight') setDirection(key.code);
            break;
        case 'ArrowRight':
            if (direction !== 'ArrowLeft') setDirection(key.code);
            break;
    }
};

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
};

const updateScore = () => {
    scoreBoard.innerText = score;
};

const createBoard = () => {
    for (let row = 0; row < boardSize; row++) {
        for (let column = 0; column < boardSize; column++) {
            const squareValue = row * boardSize + column;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        }
    }
};

const setGame = () => {
    snake = [0, 1, 2, 3];
    score = 0;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
};

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    moveInterval = setInterval(moveSnake, gameSpeed);
};
document.addEventListener('keydown', directionEvent);
startButton.addEventListener('click', startGame);

