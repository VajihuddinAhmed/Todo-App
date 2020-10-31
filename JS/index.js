'use strict'

let todos = []

const todosJSON = localStorage.getItem('todos')
if(todosJSON !== null) {
    todos = JSON.parse(todosJSON)
}
const filtering = {
    searchText: '',
    hideCompleted: false
}

const saveTodos = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

const searchingText = (item, i) => {
    const filterSearch = todos.filter((data, i) => {
        const textCompleted = data.text.toLowerCase().includes(filtering.searchText.toLowerCase())
        const hideCheckbox = !data.completed || !filtering.hideCompleted
        return textCompleted && hideCheckbox
    })

    document.querySelector('#searchDisplay').innerHTML = ''

    const IncompleteTodos = filterSearch.filter((item, i) => {
        return item.completed === false
    })
    
    const textHead = document.createElement('h2')
    const plural = IncompleteTodos.length === 1 ? '' : 's'
    textHead.classList.add('list-title')
    textHead.textContent = `You have ${IncompleteTodos.length} todo${plural} left`
    document.querySelector('#searchDisplay').appendChild(textHead)

    const deleteButton = (item, i) => {
        const todoIndex = todos.findIndex((note) => {
            return note.id === item
        }) 

        if (todoIndex > -1) {
            todos.splice(todoIndex, 1)
        }
    }

    const toggleTodo = (item) => {
        const todoSome = todos.find((todo) => {
            return todo.id === item
        }) 

        if (todoSome) { // todoSome !== undefined
            todoSome.completed = !todoSome.completed
        }
        
    }
    
    filterSearch.forEach((item, i) => {
        const todoEl = document.createElement('label')
        const containerEl = document.createElement('div')
        const checkbox = document.createElement('input')
        const todoText = document.createElement('span')
        const removeButton = document.createElement('button')

        checkbox.setAttribute('type', 'checkbox')
        checkbox.checked = item.completed
        containerEl.appendChild(checkbox)
        checkbox.addEventListener('change', () => {
            toggleTodo(item.id)
            saveTodos(todos)
            searchingText(todos, filtering)
        })

        todoText.textContent = item.text
        containerEl.appendChild(todoText)

        todoEl.classList.add('list-item')
        containerEl.classList.add('list-item__container')
        todoEl.appendChild(containerEl)

        removeButton.textContent = 'Delete'
        removeButton.classList.add('button', 'button--text')
        todoEl.appendChild(removeButton)
        removeButton.addEventListener('click', () => {
            deleteButton(item.id)
            saveTodos(todos)
            searchingText(todos, filtering)
        })
        document.querySelector('#searchDisplay').appendChild(todoEl)
        
    })
}

searchingText(todos, filtering)

document.querySelector('#newTodo').addEventListener('input', (event) => {
    filtering.searchText = event.target.value
    searchingText(todos, filtering)
})

document.querySelector('#name-form').addEventListener('submit', (event) => {
    const text = event.target.elements.firstName.value.trim()
    event.preventDefault()
    
    if (text.length > 0) {
        todos.push({
            id: uuidv4(),
            text: text,
            completed: false
        })
        localStorage.setItem('todos', JSON.stringify(todos))
        searchingText(todos, filtering)
        console.log(event.target.elements.firstName.value)
        event.target.elements.firstName.value = ''
    } 
    
})

document.querySelector('#status').addEventListener('change', (event) => {
    filtering.hideCompleted = event.target.checked
    searchingText(todos, filtering)
})


