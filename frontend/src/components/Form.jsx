import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import "../styles/Form.css"; // Ensure this contains any necessary custom styles
import LoadingIndicator from './LoadingIndicator';
import { Button, Form as BootstrapForm, Container } from 'react-bootstrap';

function Form({ route, method }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === 'login' ? 'Login' : 'Register';

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, email, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="form-container d-flex justify-content-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
            <div className="text-center" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="mb-4">RecipeGenie</h1>
                <h2 className="mb-4">{name}</h2>
                <BootstrapForm onSubmit={handleSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                    <BootstrapForm.Group controlId="formUsername">
                        <BootstrapForm.Control
                            className="form-input mb-3"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Username'
                            required
                        />
                    </BootstrapForm.Group>
                    {name !== "Login" && (
                        <BootstrapForm.Group controlId="formEmail">
                            <BootstrapForm.Control
                                className="form-input mb-3"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                                required
                            />
                        </BootstrapForm.Group>
                    )}
                    <BootstrapForm.Group controlId="formPassword">
                        <BootstrapForm.Control
                            className="form-input mb-3"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            required
                        />
                    </BootstrapForm.Group>
                    {loading && <LoadingIndicator />}
                    <Button className="form-button mb-3" type="submit" variant="primary" block>
                        {name}
                    </Button>
                    {method === "login" && (
                        <div>
                            <Button 
                                className="form-button mb-3" 
                                onClick={() => navigate('/register')}
                                variant="primary"
                                block
                            >
                                Sign Up
                            </Button>
                        </div>
                    )}
                    {method === "register" && (
                        <div>
                            <Button 
                                className="form-button mb-3" 
                                onClick={() => navigate('/login')}
                                variant="primary"
                                block
                            >
                                Back to Login
                            </Button>
                        </div>
                    )}
                </BootstrapForm>
            </div>
        </Container>
    );
}

export default Form;
