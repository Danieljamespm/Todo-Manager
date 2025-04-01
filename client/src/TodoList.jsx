import { useState, useEffect } from 'react'
import TodoItem from './TodoItem'
import { useAuth } from './AuthContext'

function TodoList() {
    const [todos, setTodos] = useState([])
    const [content, setContent] = useState('')
    const { token } = useAuth()

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await fetch('/api/todos', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await res.json()
                setTodos(data)
            } catch (error) {
                console.error('Error fetching todos:', error)
            }
        }

        if (token) {
            fetchTodos()
        }
    }, [token])

    const createNewTodo = async (e) => {
        e.preventDefault()
        if (content.length > 3) {
            try {
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
            } catch (error) {
                console.error('Error creating todo:', error)
            }
        }
    }

    return (
        <>
            <h1 className='title'>To-do Manager</h1>
            <form className='form' onSubmit={createNewTodo}>
                <input
                    type='text'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Enter a new todo..'
                    className='form__input'
                    required
                />
                <button className='form__button' type='submit'>Create To-do</button>
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