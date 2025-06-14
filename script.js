const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let start_btn = document.getElementsByClassName("start_btn")[0];

let bird = {
  x: 50,
  y: 150,
  width: 30,
  height: 30,
  gravity: 0.6,
  velocity: 0,
  lift: -12,
};
// variables

let pipes = [];
let score = 0;
let frame = 0;
let animation_id;
let gameOver = false;
let birdImg = new Image();
birdImg.src = "images/bluebird-downflap.png";

let pipeImg = new Image();
pipeImg.src = "images/pipe-green.png";

let bgImg = new Image();
bgImg.src = "images/background-night.png";

// make bird
function drawBird() {
  // ctx.fillStyle = "yellow";
  // ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// update bird
function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.height + bird.y > canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocity = 0;
  }
  if (bird.y < 0) {
    bird.y = 0;
    bird.velocity = 0;
  }
}

// update pipes
function updatePipes() {
  if (frame % 100 == 0) {
    let top = Math.random() * 200 + 50;
    let bottom = Math.random() * 200 + 50;
    pipes.push({
      x: canvas.width,
      width: 40,
      top: top,
      bottom: bottom,
    });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 2;

    // collision
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipe.width &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }

    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
      score++;
    }
  });
}

// draw pipes

// function drawPipes() {
//   ctx.fillStyle = "green";
//   pipes.forEach((pipe) => {
//     ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
//     ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
//   });
// }

function drawPipes() {
  pipes.forEach((pipe) => {
    // Top pipe (flipped image)
    ctx.save();
    ctx.translate(pipe.x + pipe.width / 2, pipe.top); // move origin to center-top of pipe
    ctx.scale(1, -1); // flip vertically
    ctx.drawImage(pipeImg, -pipe.width / 2, 0, pipe.width, pipe.top);
    ctx.restore();

    // Bottom pipe (normal image)
    ctx.drawImage(
      pipeImg,
      pipe.x,
      canvas.height - pipe.bottom,
      pipe.width,
      pipe.bottom
    );
  });
}

// score
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// draw final score
function drawGameOver() {
  start_btn.disabled = false;

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = "24px Arial";
  ctx.fillText(
    "Final Score: " + score,
    canvas.width / 2,
    canvas.height / 2 + 20
  );
  start_btn.disabled = false;
  start_btn.innerText = "Restart Game";
}

// game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();
}

function update() {
  frame++;
  updateBird();
  updatePipes();
}

function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    animation_id = requestAnimationFrame(gameLoop);
  } else {
    drawGameOver();
  }
}

// key press
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    bird.velocity = bird.lift;
  }
});

// start
start_btn.addEventListener("click", () => {
  resetGame();
  gameLoop();
  start_btn.disabled = true;
  start_btn.innerText = "Playing...";
});

// reset the game
function resetGame() {
  cancelAnimationFrame(animation_id); // 🛑 stop old game loop

  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  ctx.textAlign = "start"; // Reset score alignment

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
