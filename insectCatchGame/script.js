const screens = document.querySelectorAll('.screen')
const buttons = document.querySelectorAll('.choose-insect-btn')
const startBtn = document.getElementById('start-btn')
const timeEl = document.getElementById('time')
const scores = document.getElementById('score')
const msg = document.getElementById('message')
const gameCon = document.getElementById('game-container')

let seconds = 0
let score = 0
let selectedInsects = {}

startBtn.addEventListener('click', () => screens[0].classList.add('up'))
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img')
    const src = img.getAttribute('src')
    const alt = img.getAttribute('alt')
    selectedInsects = { src, alt }
    screens[1].classList.add('up')
    setTimeout(createInsect, 1000)
    startGame()
  })
})


function startGame(){
    setInterval(increaseTime, 1000)
}

function increaseTime(){
    let min = Math.floor(seconds / 60)
    let s = seconds % 60 
    min = min < 10 ? `0${min}` : min
    s = s < 10 ? `0${s}` : s
    timeEl.innerHTML = `Time  ${min} : ${s}`
    seconds++
}

function createInsect () {
  const insect = document.createElement('div')
  insect.classList.add('insect')
  const { x, y } = getRandomLocation()
  insect.style.top = `${y}px`
  insect.style.left = `${x}px`
  insect.innerHTML = `<img src="${selectedInsects.src}" alt="${ selectedInsects.alt}" style="transform : rotate(${Math.random() * 360}deg)" />`

  insect.addEventListener('click', catchInsect)

  gameCon.appendChild(insect)
}

function getRandomLocation () {
  const width = window.innerWidth
  const hight = window.innerHeight
  const x = Math.random() * (width - 200) + 100
  const y = Math.random() * (hight - 200) + 100
  return { x, y }
}


function catchInsect(){
    increaseScore()
    this.classList.add('caught')
    setTimeout(()=>this.remove() , 2000)
    addInsect()
}

function addInsect(){
    setTimeout(createInsect ,1000)
    setTimeout(createInsect ,1500)

}

function increaseScore(){
    score++
    if(score> 19){
        msg.classList.add('visible')
    }
    scores.innerHTML = `Score : ${score}`
}