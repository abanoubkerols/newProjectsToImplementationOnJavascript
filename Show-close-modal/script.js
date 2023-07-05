'use strict';
const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const btnCloseModel = document.querySelector('.close-modal')
const btnsOpenModel = document.querySelectorAll('.show-modal')

for (let i = 0; i < btnsOpenModel.length; i++) {
    btnsOpenModel[i].addEventListener('click', openModal)
}

function closeModal() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}


function openModal() {
    modal.classList.remove('hidden')
    overlay.classList.remove('hidden')
}

btnCloseModel.addEventListener('click', closeModal)

overlay.addEventListener('click', closeModal)

document.addEventListener('keydown', function (e) {

    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {

        closeModal()

    }
})