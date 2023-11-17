const rulesBtn = document.getElementById('rules-btn')
const closeBtn = document.getElementById('close-btn')
const rules = document.getElementById('rules')
const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')

let score = 0
const brickRowCount = 9
const brickColumnCount = 5

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 3,
  dy: -3
}

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  width: 80,
  height: 10,
  speed: 8,
  dx: 0
}
const brickInfo = {
  w: 69,
  h: 20,
  padding: 5,
  offsetX: 20,
  offsetY: 60,
  visible: true
}

const bricks = []
for (let r = 0; r < brickRowCount; r++) {
  bricks[r] = []
  for (let c = 0; c < brickColumnCount; c++) {
    const x = r * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX
    const y = c * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY
    bricks[r][c] = { x, y, ...brickInfo }
  }
}
console.log(bricks)

function drawBall () {
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2, true)
  ctx.fillStyle = '#0095dd'
  ctx.fill()
  ctx.closePath()
}

function drawPaddle () {
  ctx.beginPath()
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height)
  ctx.fillStyle = '#0095dd'
  ctx.fill()
  ctx.closePath()
}

function drawScore () {
  ctx.font = '30px Arial'
  ctx.fillText(`Score : ${score}`, canvas.width - 140, 30)
}

function drawBricks () {
  bricks.forEach(col => {
    col.forEach(brick => {
      ctx.beginPath()
      ctx.rect(brick.x, brick.y, brick.w, brick.h)
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent'
      ctx.fill()
      ctx.closePath()
    })
  })
}
function movePaddle () {
  paddle.x += paddle.dx
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width
  }

  if (paddle.x < 0) {
    paddle.x = 0
  }
}
function moveBall () {
  ball.x += ball.dx
  ball.y += ball.dy

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1
  }

  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1
  }

  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.width &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed
  }

  bricks.forEach(col => {
    col.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1
          brick.visible = false
          increaseScore()
        }
      }
    })
  })


  if(ball.y + ball.size > canvas.height ){
    showAllBricks()
    score = 0
  }


}

function increaseScore(){
    score++
    if(score % (brickRowCount * brickRowCount ) === 0 ){
        showAllBricks()
    }
}

function showAllBricks(){
    bricks.forEach(col =>{
        col.forEach(brick =>{
            brick.visible = true
        })
    })
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall()
  drawPaddle()
  drawScore()
  drawBricks()
}

function update () {
  movePaddle()
  moveBall()
  draw()
  requestAnimationFrame(update)
}
update()

function keyDown (e) {
  if (e.key == 'ArrowLeft') {
    paddle.dx = -paddle.speed
  }
  if (e.key == 'ArrowRight') {
    paddle.dx = paddle.speed
  }
}

function keyUP (e) {
  if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
    paddle.dx = 0
  }
}

document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUP)

rulesBtn.addEventListener('click', () => rules.classList.add('show'))
closeBtn.addEventListener('click', () => rules.classList.remove('show'))
