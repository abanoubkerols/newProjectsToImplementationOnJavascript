'use strict';
const number = Math.trunc(Math.random() * 20) + 1
let score = 20
let guess = document.querySelector('.guess')
let highScore = 0
document.querySelector('.check').addEventListener('click', function () {
    let guessInput = Number(guess.value)

    if (!guessInput) {
        document.querySelector('.message').textContent = '❌ NO NUMBER'
    } else if (guessInput === number) {
        document.querySelector('.message').textContent = ' 🥳 Correct Number '

        document.querySelector('body').style.backgroundColor = '#60b347'
        document.querySelector('.number').textContent = number

        if (score > highScore) {
            highScore = score
            document.querySelector('.highscore').textContent = highScore
        }

    }
    else if (guessInput !== number) {
        if (score > 1) {
            document.querySelector('.message').textContent = guessInput > number ? ' Too High ' : 'Too Low'
            score--
            document.querySelector('.score').textContent = score
        } else {
            document.querySelector('.message').textContent = 'You Lost'
            document.querySelector('.score').textContent = 0
        }
    }
})


document.querySelector('.again').addEventListener('click', function () {
    score = 20
    document.querySelector('.score').textContent = score
    document.querySelector('.number').textContent = '?'
    document.querySelector('body').style.backgroundColor = '#222'
    document.querySelector('.message').textContent = ' Start guessing... '
    guess.value = ''

})