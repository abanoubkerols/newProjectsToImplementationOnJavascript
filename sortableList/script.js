const draggableList = document.getElementById('draggable-list')
const check = document.getElementById('check')

const richestPeople = [
  'Jeff Bezos',
  'Bill Gates',
  'Warren Buffett',
  'Bernard Arnault',
  'Carlos Slim Helu',
  'Amancio Ortega',
  'Larry Ellison',
  'Mark Zuckerberg',
  'Michael Bloomber g',
  'Larry Page'
]

const listItems = []

let dragStartIndex
createList()
function createList () {
  [...richestPeople]
    .map(a => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value)
    .forEach((per, index) => {


        let li = document.createElement('li')
        li.setAttribute('data-index', index)
        li.innerHTML = `
            <span class="number">${index + 1}</span>
            <div class="draggable" draggable="true">
                <p class="person-name">${per}</p>
                <i class="fas fa-grip-lines"></i>
            </div>
            `
        listItems.push(li)
        draggableList.appendChild(li)
        })

        addEventListeners()
}

function dragStart(){

    dragStartIndex = +this.closest('li').getAttribute('data-index')
}

function dragDrop(){
    const dragEndIndex = +this.getAttribute('data-index')
    swapItems(dragStartIndex , dragEndIndex)
    this.classList.remove('over')
}

function dragEnter(){
    this.classList.add('over')
}

function dragLeave(){
    this.classList.remove('over')

    
}

function dragOver(e){
    e.preventDefault();
    
}

function swapItems(fromIndex , toIndex){
    const itemOne = listItems[fromIndex].querySelector('.draggable')
    const itemTwo = listItems[toIndex].querySelector('.draggable')

    listItems[fromIndex].appendChild(itemTwo)
    listItems[toIndex].appendChild(itemOne)


}
function addEventListeners(){
    const draggables = document.querySelectorAll('.draggable')
    const dragListItems = document.querySelectorAll('.draggable-list li')

    draggables.forEach((drag)=>{
        drag.addEventListener('dragstart' , dragStart)
    })

    dragListItems.forEach((item)=>{
        item.addEventListener('dragover' , dragOver)
        item.addEventListener('drop' , dragDrop)
        item.addEventListener('dragenter' , dragEnter)
        item.addEventListener('dragleave' , dragLeave)
    })
}

function checkOrder(){
    listItems.forEach((listItem , index )=>{
        const personName = listItem.querySelector('.draggable').innerText.trim()

        if(personName !== richestPeople[index]){
            listItem.classList.add('wrong')
        }else{
            listItem.classList.remove('wrong')
            listItem.classList.add('right')
        }
    })



}

check.addEventListener('click' ,checkOrder)