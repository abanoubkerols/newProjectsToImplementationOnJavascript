const main = document.getElementById('main');
const addsUserBtn = document.getElementById('add-user');
const doubleBtn = document.getElementById('double');
const showMillionairesBtn = document.getElementById('show-millionaires')
const sortBtn = document.getElementById('sort')
const calculateWealthBtn = document.getElementById('calculate-wealth')

let data = [];

getRandomUser()
getRandomUser()
getRandomUser()
getRandomUser()


async function getRandomUser() {
    const res = await fetch('https://randomuser.me/api');
    const data = await res.json()

    const user = data.results[0];

    const newUser = {
        name: `${user.name.first} ${user.name.last}`,
        money: Math.floor(Math.random() * 1000000)
    }

    addData(newUser)

}



function addData(obj) {
    data.push(obj)

    updateDom()
}


function doubleMoney() {
    data = data.map(user => {
        return { ...user, money: user.money * 2 }
    })
    updateDom()
}


function sortByRichest() {
    data = data.sort((a, b) => b.money - a.money)
    updateDom()
}

function showMillionaires() {
    data = data.filter(user => user.money > 1000000)
    updateDom()
}

function calculateWealth() {
    const wealth = data.reduce((acc, user) => (acc += user.money), 0)

    const wealthEl = document.createElement('div')
    wealthEl.innerHTML = `<h3>Totla Wealth : <stron>${formatMoney(wealth)}</stron></h3>`

    main.appendChild(wealthEl)
}



function updateDom(provideData = data) {
    main.innerHTML = '<h2><strong>Person</strong> Wealth</h2>'

    provideData.forEach((item) => {
        const ele = document.createElement('div');
        ele.classList.add('person')
        ele.innerHTML = `<strong>${item.name}</strong> <strong>${formatMoney(item.money)}</strong>`
        main.appendChild(ele)

    })
}

function formatMoney(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
}

addsUserBtn.addEventListener('click', getRandomUser)
doubleBtn.addEventListener('click', doubleMoney)
sortBtn.addEventListener('click', sortByRichest)
showMillionairesBtn.addEventListener('click', showMillionaires)
calculateWealthBtn.addEventListener('click', calculateWealth)