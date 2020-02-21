const rulesBtn = document.getElementById("rules-btn"),
      closeBtn = document.getElementById("close-btn"),
      rules = document.getElementById("rules"),
      canvas = document.getElementById("canvas");

const ctx = canvas.getContext('2d');

const bricksRowCount = 9;
const bricksColCount = 5;

let score = 0;
//Create ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};

//Create Paddle properties
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    width: 80,
    height: 10,
    speed: 8,
    dx: 0
};

//Create brick properties
const brickInfo = {
    width: 70,
    height: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true 
};

//Create bricks
const bricks = [];

for(let i=0 ; i<bricksRowCount ; i++){
    bricks[i] = [];
    for(let j = 0; j<bricksColCount ; j++){
        const x = i * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = {x, y, ...brickInfo};
    }
}
//Draw a ball on canvas
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

//Draw paddle on canvas
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}

//Draw bricks on canvas
function drawBricks(){
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.width, brick.height);
            ctx.fillStyle = brick.visible ? "#0095dd" : "transparent"
            ctx.fill();
            ctx.closePath();
        })
    });
}
//Draw score on canvas
function drawScore(){
    ctx.font = "20px arial";
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}


//Draw everything
function draw(){
    //Clear Canvas
    ctx.clearRect(0, 0 , canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

//Move paddle on canvas
function movePaddle(){
    paddle.x += paddle.dx;

    //Wall detection
    if(paddle.width + paddle.x > canvas.width){
        paddle.x = canvas.width - paddle.width;
    }
    if(paddle.x < 0){
        paddle.x = 0;
    }
}

function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;

    //Wall collision (x axis)
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
        ball.dx *= -1;
    }

    //Wall collison (y axis)
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
        ball.dy *= -1;
    }

    //Paddle collison
    if( 
        ball.x - ball.size > paddle.x && 
        ball.x + ball.size < paddle.x + paddle.width && 
        ball.y + ball.size > paddle.y)
        {
            ball.dy = -ball.speed;    
        }
    
    //Bricks collison
    bricks.forEach(column => {
        column.forEach(brick => {
            if(brick.visible){
                if (
                    ball.x - ball.size > brick.x && // left brick side check
                    ball.x + ball.size < brick.x + brick.width && // right brick side check
                    ball.y + ball.size > brick.y && // top brick side check
                    ball.y - ball.size < brick.y + brick.height // bottom brick side check
                  ) {
                    ball.dy *= -1;
                    brick.visible = false;
          
                    increaseScore();
                  }
            }
        })
    });     

    //Hit bottom wall - Lose
    if(ball.y + ball.size > canvas.height){
        showAllBricks();
        score = 0;
    }
}

function increaseScore(){
    score++;

    if(score % (bricksRowCount * bricksColCount) === 0){
        showAllBricks();
    }
}
//Show all bricks
function showAllBricks(){
    bricks.forEach(column => {
        column.forEach(brick => brick.visible = true);
    });
}

//Update canvas drawing and animation
function update(){

    movePaddle();
    moveBall();

    //Draw everything
    draw();

    requestAnimationFrame(update);
}

update();

function keyDown(e){
    if(e.key === "Right" || e.key === "ArrowRight"){
        paddle.dx = paddle.speed;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft"){
        paddle.dx = -paddle.speed;
    }
}

function keyUp(e){
    if(e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft"){
        paddle.dx = 0;
    }
}
//Keyboard event handlers
document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

//Rules and close event handlers
rulesBtn.addEventListener("click",function(){
    rules.classList.add("show");
});

closeBtn.addEventListener("click",function(){
    rules.classList.remove("show");
});