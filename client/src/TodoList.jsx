import { useState, useEffect } from 'react'
import TodoItem from './TodoItem'

function TodoList({ token }) {
    const [todos, setTodos] = useState([])
    const [content, setContent] = useState('')
    
    useEffect(() => {
        getTodos()
    }, [])

    const getTodos = async () => {
        const res = await fetch("/api/todos", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const todos = await res.json()
        setTodos(todos)
    }

    const createNewTodo = async (e) => {
        e.preventDefault()
        if (content.length > 3) {
            const res = await fetch('/api/todos', {
                method: 'POST',
                body: JSON.stringify({ todo: content }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            const newTodo = await res.json()

            setContent('')
            setTodos([...todos, newTodo])
        }
    }

    return (
        <>
            <h1 className='title'>Todo Manager</h1>
            <form className='form' onSubmit={createNewTodo}>
                <input
                    type='text'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Enter a new todo..'
                    className='form__input'
                    required
                />
                <button className='form__button' type='submit'>Create Todo</button>
            </form>
            <div className='todos'>
                {(todos.length > 0) && 
                    todos.map((todo) => (
                        <TodoItem 
                            key={todo._id} 
                            todo={todo} 
                            setTodos={setTodos}
                            token={token}
                        />
                    ))
                }
            </div>
        </>
    )
}

export default TodoList;