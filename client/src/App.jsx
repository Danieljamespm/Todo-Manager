import { useState } from 'react'
import TodoList from './TodoList'
import Login from './Login'
import Register from './Register'
import { AuthProvider, useAuth } from './AuthContext'
import './styles.css'

function AppContent() {
    const { isAuthenticated, logout, token } = useAuth();
    const [showRegister, setShowRegister] = useState(false);

    if (!isAuthenticated) {
        return (
            <div className="auth-container">
                {showRegister ? (
                    <>
                        <Register />
                        <button onClick={() => setShowRegister(false)}>
                            Switch to Login
                        </button>
                    </>
                ) : (
                    <>
                        <Login />
                        <button onClick={() => setShowRegister(true)}>
                            Register
                        </button>
                    </>
                )}
            </div>
        );
    }

    return (
        <main className="container">
            <button onClick={logout} className="logout-button">
                Logout
            </button>
            <TodoList token={token} />
        </main>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;