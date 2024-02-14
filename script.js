// HTML Elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

// Game Settings
const boardSize = 10; // el tamaño que es de 10 x 10
const gameSpeed = 100; //100milisegundos es la velocidad de la serpiente
const squareTypes = { // Tipos de cuadrados 
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2,
};

const directions = { // Cuantos cuadros se muve cuando presionamos la direccion
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

// VARIABLES 
let snake; 
let score;
let direction; // cuando el usuario teclea, en que direccion va
let boardSquares; //el array con la informacion del tablero 
let emptySquares; // array con lugares vacios para generar la comida aleatoriamente
let moveInterval; // cada cuanto se llama a la funcion 

const drawSnake = () => {
    snake.forEach( square => drawSquare(square, 'snakeSquare')); // Por cada elemento de la snake que es un array, le pedimos que gregue uno de tipo snakeSquare
}

// RELLENAR CADA CUADRADO DEL TABLERO
// PARAMETROS de la funcion drawSquare
// square = la posicion del cuadarado que queremos pintar
// type = que tipo de cuadrado es (emptySquare,snakeSquare,foodSquare)
const drawSquare = (square, type) => {
    // debemos separar la posicion(square) que nos llega como [00], separamos la fila de la columna 
    const [row, column ] = square.split('');
    boardSquares[row][column] = squareTypes[type];// hacemos que el cuadro tenga el tipo de cuadro que nos pasan como parametro (type)
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);// le modificamos el color segun el tipo

    // aqui validamos si es un emptySquare(que es lo que queremos crear), para ver si lo agregamos o lo sacamos
    if(type === 'emptySquare'){
        emptySquares.push(square); // si es igual se lo agregamos al array de emptySquare(que seria uno inmediatamente despues de la cola de la snake que se va liberando)
    } else {
        if(emptySquares.indexOf(square) !== -1){ //Pero primero validamos si ya el array lo contiene, por que puede ser un elemento de la snake
            emptySquares.splice(emptySquares.indexOf(square), 1);// si no es emptySquare, lo sacamos del array
        }
    }
}

const moveSnake = () => {
    const newSquare = String( 
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    const [row, column ] = newSquare.split('');

    if(newSquare < 0 || // controlammos si toca las paredes (arriba, abajo, a los lados )
        newSquare > boardSize * boardSize ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9) ||
        boardSquares[row][column] === squareTypes.snakeSquare) {
        gameOver();
    } else {
        snake.push(newSquare);// agregamos un square a la snake por que comio 
        if(boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift(); // sacamos el primer valor de la snake, que seria la cola, y lo pintamos vacio, porque esta avazando 
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval)
    startButton.disabled = false; 
}

const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
    }
}

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

const updateScore = () => {
    scoreBoard.innerText = score;
}

const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    })
}

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length - 4;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares)
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake(); // FUNCION PARA DIBUJAR LA SERPIENTE 
    updateScore(); // FUNCION PARA ACTUALIZAR EL SCORE
    createRandomFood(); // FUNCION PARA CREAR LA COMIDA EN UN LUGAR RANDOM 
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval( ( ) => moveSnake(), gameSpeed);
}

startButton.addEventListener('click', startGame);