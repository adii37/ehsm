import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
    const [empId, setEmpId] = useState('00000001');
    const [password, setPassword] = useState('KAAR@1');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(empId, password);
            if (response.success) {
                localStorage.setItem('user', JSON.stringify({ empId, ...response.data }));
                navigate('/dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>EHSM Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Employee ID</label>
                        <input
                            type="text"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error}</p>}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
