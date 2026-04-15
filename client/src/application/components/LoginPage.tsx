import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, User } from '../contexts/AuthContext';
import { apiClient } from '../../domain/utils/apiClient';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiClient.post<{ user: User; token: string }>(
                '/auth/login',
                { email, password },
            );
            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError((err as Error).message || 'Échec de la connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mt-5 shadow-sm">
            <Card.Body>
                <h2 className="text-center mb-4">Connexion</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" id="email">
                        <Form.Label>Adresse Mail</Form.Label>
                        <Form.Control
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" id="password">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        disabled={loading}
                        className="w-100 mt-3"
                        type="submit"
                    >
                        Se connecter
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    Pas de compte ? <Link to="/register">S&apos;inscrire</Link>
                </div>
            </Card.Body>
        </Card>
    );
};
