const form = document.getElementById('form')
const input = document.getElementById('input')
const todoUL = document.getElementById('todos')

const todos = JSON.parse(localStorage.getItem('Actions'))

if (todos) {
  todos.forEach(todo => addTodo(todo))
}

form.addEventListener('submit', e => {
  e.preventDefault()
  addTodo()
})

function addTodo (todo) {
  let todoText = input.value
  if (todo) {
    todoText = todo.text
  }

  if (todoText) {
    let li = document.createElement('li')
    if (todo && todo.completed) {
      li.classList.add('completed')
    }

    li.innerText = todoText
    li.addEventListener('click', () => {
      li.classList.toggle('completed')
      updateLS()
    })
    li.addEventListener('contextmenu', e => {
      e.preventDefault()
      li.remove()
      updateLS()
    })
    todoUL.appendChild(li)
    input.value = ''

    updateLS()
  }
}

function updateLS () {
  let todosEl = document.querySelectorAll('li')
  const todos = []
  todosEl.forEach(todoEl => {
    todos.push({
      text: todoEl.innerText,
      completed: todoEl.classList.contains('completed')
    })
  })

  localStorage.setItem('Actions', JSON.stringify(todos))
}
