const API_URL = 'http://localhost:5000'; 

function TodoItem({todo, setTodos, token}){
    

    const updateTodo = async (todoId, todoStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/todos/${todoId}`, {
                method: "PUT",
                body: JSON.stringify({status: todoStatus}),
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                },
            });

            const json = await res.json();
            if(json.acknowledged) {
                setTodos(currentTodos => {
                    return currentTodos.map((currentTodo) => {
                        if(currentTodo._id === todoId){
                            return {...currentTodo, status: !currentTodo.status};
                        }
                        return currentTodo;
                    });
                });
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (todoId) => {
        try {
            const res = await fetch(`${API_URL}/api/todos/${todoId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            const json = await res.json()
            if(json.acknowledged) {
                setTodos(currentTodos => {
                    return currentTodos.filter((currentTodo) => (currentTodo._id !== todoId))
                })
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };
    
    
    return (
        <div className='todo'>
            <p>{todo.todo}</p>
            <div className="mutations">
              <button 
              className='todo__status'
              onClick={() => updateTodo(todo._id, todo.status)}
              >
                {todo.status ? '✓' : '✗'}
              </button>
              <button
                className="todo__delete"
                onClick={() => deleteTodo(todo._id)}
              >
                🗑️
              </button>
            </div>
          </div>
    )
}

export default TodoItem