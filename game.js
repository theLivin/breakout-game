var canvas = document.getElementById("myCanvas");

// store the 2D rendering context
var ctx = canvas.getContext("2d");

// keep track of score
var score = 0;

// player lives
var lives = 3;

// count broken bricks
var numberOfBrokenBricks = 0;

// keep track of level
var level = 1;


// starting x and y cordinate of circle
var x = canvas.width/2;
var y = canvas.height - 30;

// value to change x and y cordinates
var dx = 2;
var dy = -2;

// store radius of ball
var ballRadius = 10;

// define paddle to hit the ball
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;
var paddleY = canvas.height - paddleHeight;

// check pressed buttons
var rightPressed = false;
var leftPressed = false;

// setup brick variables
var brickRowCount = 3,
    brickColumnCount = 5,
    brickWidth = 75,
    brickHeight = 20,
    brickPadding = 10,
    brickOffsetTop = 30,
    brickOffsetLeft = 30;

// create an array of bricks and populat
var bricks = [];
for( var c=0; c < brickColumnCount; c++){
  // make the array multidimensional
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++){
    bricks[c][r] = {x: 0, y:0, status: 1};
  }
}

// add audio to game
var brickSound = new Audio("sounds/brick.mp3");
var gameOverSound = new Audio("sounds/game-over.mp3");
var loseLifeSound = new Audio("sounds/loselife.mp3");
var hitPaddleSound = new Audio("sounds/paddle.mp3");
var winSound = new Audio("sounds/win.mp3");

// draw bricks on canvas
function drawBricks() {
  for(var c=0; c<brickColumnCount; c++){
    for(var r=0; r<brickRowCount; r++){
      // draw brick if brick status is 1
      if ( bricks[c][r].status == 1){
        var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;

        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// draw ball on Canvas
function drawBall(){
  // draw a circle
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// draw collided ball
function drawCollidedBall() {
    // draw a circle
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

// draw paddle on canvas
function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// clear canvas,
function draw() {
  // clear the canvas before each frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw bricks
  drawBricks();

  // draw the ball
  drawBall();

  // draw paddle
  drawPaddle();

  // draw score
  drawScore();

  // draw lives
  drawLives();

  // draw level
  drawLevel();

  // detect ball collision with brick
  collisionDetection();

  // change position of circle
  x += dx;
  y += dy;

  // reverse direction of ball if it reaches edges
  if( x + dx > canvas.width - ballRadius || x + dx < ballRadius ){//left and right edges
    dx = -dx;
  }
  if( y + dy < ballRadius){
      dy = -dy;
  }else if (y + dy > canvas.height - ballRadius){
    // let paddle hit the ball
    if( x > paddleX && x < paddleX + paddleWidth ){
      // play paddle audio
      hitPaddleSound.play();
      // reverse direction
      dy = -dy;
    }
    else {
      //decrease lives if ball falls
      lives--;
      // play loselive audio
      loseLifeSound.play();

      if( !lives ){
        // play gameover audio
        gameOverSound.play();

        // end game if no life is available
        alert("GAME OVER\nYOUR SCORE: "+score);
        numberOfBrokenBricks = 0;
        document.location.reload();
        //clearInterval(interval);
      }else{
        //reset ball on paddle
        x = canvas.width/2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth)/2;
      }
    }
  }

  // move paddle
  if(rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  }
  else if(leftPressed) {
    paddleX -= 7;
    if( paddleX < 0){
      paddleX = 0;
    }
  }


  requestAnimationFrame(draw);
}// end draw()

// detect ball collision with bricks
function collisionDetection(){
  for(var c=0; c<brickColumnCount; c++){
    for(var r=0; r<brickRowCount; r++){
      var b = bricks[c][r];
      if(b.status == 1){
        if( x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
          dy = -dy;
          numberOfBrokenBricks ++;
          brickSound.play();

          drawCollidedBall();

          // change brick status if ball hits brick
          b.status = 0;
          score += (level + 1);

          if(numberOfBrokenBricks >= brickRowCount * brickColumnCount){
            // play win sound
            winSound.play();

            restartGame();

          }
        }
      }
    }
  }
}


function restartGame() {
  setTimeout(function() {
    numberOfBrokenBricks = 0;
    level++;

    dy *= 2;

    if(brickWidth < 0 || brickHeight < 0){
      alert("YOU WIN, CONGRATULATIONS\nYOUR SCORE: "+score);
      document.location.reload();
    }

    // add more bricks
    for( var c=0; c < brickColumnCount; c++){
      // make the array multidimensional
      bricks[c] = [];
      for(var r=0; r<brickRowCount; r++){
        bricks[c][r] = {x: 0, y:0, status: 1};
      }
    }

    drawBricks();
  }, 100);
}

var fontType = "16px "+"'Overpass Mono', monospace";

// draw score on Canvas
function drawScore(){
  ctx.font = fontType;
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}

// draw lives on Canvas
function drawLives(){
  ctx.font = fontType;
  ctx.fillStyle = "#0095DD";
  ctx.fillText("❤x"+lives, canvas.width-43, 20);
}

// draw level on canvas
function drawLevel(){
  ctx.font = fontType;
  ctx.fillStyle = "#009547";
  ctx.fillText("Level "+level, canvas.width/2 - 30, 20);
}

// handle keydown
function keyDownHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft"){
    leftPressed = true;
  }
}

// handle keyup
function keyUpHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft"){
    leftPressed = false;
  }
}

// handle mouse movement
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width){
    paddleX = relativeX - paddleWidth/2;
  }
}

// listen for keyup and keydown
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// listen for mouse movement
document.addEventListener("mousemove", mouseMoveHandler, false);

// execute draw() every 10ms
// var interval = setInterval(draw, 10);

// run the game
draw();
