//Variables
const game=document.getElementById('game')
const image=document.querySelector('#border3 img')
const text=document.querySelector('#border3 h2')
const highScoreDisplay = document.getElementById('highScore')
const scoreDisplay = document.getElementById('score')
let isGame=false
let score= 0
let highScore = 0
let snakeElement = [];
let snakePos= []
let intervalId;
let foodPos = {}
let direction = 'ArrowRight'


//Create Cube
const createCube=()=>{
    element = document.createElement('div')
    element.style.width='20px'
    element.style.height='20px'
    element.style.position = 'absolute';
    return element
}

//Set Position
function setPosition(element,position){
    element.style.top = (144 + (position.y-1) * 20)+'px'
    element.style.left = (innerWidth/2 - 200 + (position.x -1) * 20)+'px'
}

//Add Snake
const addSnake = (position) => {
    snake = createCube();
    snakeElement.unshift(snake)
    snake.classList.add('snake');
    snakePos.unshift(position)
};

//Render Snake
const renderSnake=()=>{
    snakeElement.forEach((element,index)=>{
        game.appendChild(element);
        setPosition(element, snakePos[index]);
    })
}

//Move Snake
const moveSnake = () => {
    addSnake({x: 10, y: 10})
    renderSnake()
    intervalId = setInterval(() => {
        let newHead = { ...snakePos[0] };
        switch (direction) {
            case 'ArrowUp':
                newHead.y -= 1;
                break;
            case 'ArrowDown':
                newHead.y += 1;
                break;
            case 'ArrowLeft':
                newHead.x -= 1;
                break;
            case 'ArrowRight':
                newHead.x += 1;
                break;
            default:
                newHead.x += 1;
        }
        // Add the new head position to the snake
        addSnake(newHead);

        if(checkCollision()){
            gameOver()
            return
        }

        // Remove the last part of the snake to simulate movement
        if(newHead.x === foodPos.x && newHead.y === foodPos.y){
            const food = document.getElementById('food')
            game.removeChild(food)
            addFood()
            score++
            scoreDisplay.textContent=`${score>99 ? '':'0'}${score > 9 ? '':'0'}${score}`
        }else{
            const oldTail = snakeElement.pop();
            game.removeChild(oldTail);
            snakePos.pop();
        }
        // Render the updated snake
        renderSnake();
    }, 200);
};

//Game Over
const gameOver=()=>{
    clearInterval(intervalId)
    isGame = false;
    if(score>highScore) highScore= score
    highScoreDisplay.textContent=`${highScore>99 ? '':'0'}${highScore > 9 ? '':'0'}${highScore}`
    snakeElement = [];
    snakePos= []
    score = 0
    scoreDisplay.innerText='000'
    alert('Game Over! Press Space to Restart')
    game.style.display='none'
    text.style.display='block'
    image.style.display='block'
    game.innerHTML=""

}

//Change Direction
const changeDirection=(key)=>{
    direction = key
}
//Check collision
const checkCollision=()=>{
    const seen = new Set(); // Conjunto para almacenar los elementos únicos
    for (let position of snakePos) {
            if (seen.has(position)) {
                return true; // Hay un duplicado
            }
            seen.add(position); // Agregar el valor al conjunto si no está
        }
    if (snakePos[0].x < 1 || snakePos[0].x > 20 || snakePos[0].y < 1 || snakePos[0].y > 20) return true
}

//Generate Food Position
const generateFoodPosition=()=>{
    const fHeight=Math.floor(Math.random()*20)+1
    const fWidth=Math.floor(Math.random()*20)+1
    foodPos = {x: fWidth, y: fHeight}
}

//Add Food
const addFood=()=>{
    generateFoodPosition()
    for(let i=0; i < snakePos.length; i++){
        while ( foodPos.x === snakePos[i].x && foodPos.y === snakePos[i].y){
            generateFoodPosition()
        }
    }
    const food = createCube()
    game.appendChild(food)
    food.id = 'food'
    setPosition(food, foodPos)
}

//Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && !isGame) {
        game.style.display='grid'
        text.style.display='none'
        image.style.display='none'
        addFood()
        moveSnake()
        isGame=true
    }
});

document.addEventListener('keydown',({key})=>{
    changeDirection(key)
})