const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear')
const itemFilter = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')
let items
let editMode = false

function displayItems () {
  const itemsFromStorage = getItemFromStorage()
  itemsFromStorage.forEach(item => addItemToDom(item))
  checkUi()
}

function checkIsItemExists (item) {
  const itemFormStorage = getItemFromStorage()
  return itemFormStorage.includes(item)
}

function addItem (e) {
  e.preventDefault()

  const newItem = itemInput.value

  // Validate Input
  if (newItem === '') {
    alert('Please add an item')
    return
  }

  if (editMode) {
    const itemToEdit = itemList.querySelector('.edit-mode')
    removeFromStorage(itemToEdit.textContent)
    itemToEdit.classList.remove('edit-mode')
    itemToEdit.remove()
    editMode = false
  } else if (checkIsItemExists(newItem)) {
    alert('this Item already Exists ')
    itemInput.value = ''
    return
  }

  addItemToDom(newItem)
  addItemToStorage(newItem)
  itemInput.value = ''
  itemFilter.value = ''
  checkUi()
}

function addItemToDom (item) {
  // Create list item
  const li = document.createElement('li')
  li.appendChild(document.createTextNode(item))

  const button = createButton('remove-item btn-link text-red')
  li.appendChild(button)

  itemList.appendChild(li)
}

function addItemToStorage (item) {
  const itemFormStorage = getItemFromStorage()

  itemFormStorage.push(item)

  localStorage.setItem('items', JSON.stringify(itemFormStorage))
}

function getItemFromStorage () {
  let itemFormStorage
  if (localStorage.getItem('items') === null) {
    itemFormStorage = []
  } else {
    itemFormStorage = JSON.parse(localStorage.getItem('items'))
  }

  return itemFormStorage
}

function createButton (classes) {
  const button = document.createElement('button')
  button.className = classes
  const icon = createIcon('fa-solid fa-xmark')
  button.appendChild(icon)
  return button
}

function createIcon (classes) {
  const icon = document.createElement('i')
  icon.className = classes
  return icon
}

function onclickItem (e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement)
  } else if (e.target.closest('li')) {
    setItemToEdit(e.target)
  }
}

function setItemToEdit (item) {
  editMode = true
  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'))
  item.classList.add('edit-mode')
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
  formBtn.style.backgroundColor = '#228b22'
  itemInput.value = item.textContent
}

function removeItem (item) {
  if (confirm('Are you sure?')) {
    item.remove()
    removeFromStorage(item.textContent)
    checkUi()
  }
}

function removeFromStorage (item) {
  let itemRemove = getItemFromStorage()
  itemRemove = itemRemove.filter(i => i !== item)
  localStorage.setItem('items', JSON.stringify(itemRemove))
}

function clearItems () {
  if (confirm('Are you sure?')) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild)
    }

    localStorage.removeItem('items')
  }
  checkUi()
}

function checkUi () {
  items = itemList.querySelectorAll('li')

  if (items.length === 0) {
    clearBtn.style.display = 'none'
    itemFilter.style.display = 'none'
  } else {
    clearBtn.style.display = 'block'
    itemFilter.style.display = 'block'
  }

  formBtn.innerHTML = '<i class="fa solid fa-plus"></i> Add Item'
  formBtn.style.backgroundColor = '#333'
  editMode = false
}

function filterItem (e) {
  const text = e.target.value.toLowerCase()
  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase()
    if (itemName.indexOf(text) !== -1) {
      item.style.display = 'flex'
    } else {
      item.style.display = 'none'
    }
  })
}

function init () {
  itemForm.addEventListener('submit', addItem)
  itemList.addEventListener('click', onclickItem)
  clearBtn.addEventListener('click', clearItems)
  itemFilter.addEventListener('input', filterItem)
  document.addEventListener('DOMContentLoaded', displayItems)
  checkUi()
}

init()
