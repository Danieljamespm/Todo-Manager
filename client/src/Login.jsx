import { useState } from 'react';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5000'; // Add server URL

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        
        try {
            const response = await fetch(`${API_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                throw new Error('Unable to connect to server. Please try again.');
            }

            if (!response.ok) {
                throw new Error(errorData.message || 'Login failed');
            }

            if (!errorData.token) {
                throw new Error('No token received from server');
            }
            
            login(errorData.token);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}