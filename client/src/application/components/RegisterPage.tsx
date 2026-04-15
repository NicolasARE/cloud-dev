import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../domain/utils/apiClient';

export const RegisterPage: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirm) {
            return setError('Les mots de passe ne correspondent pas');
        }

        setLoading(true);

        try {
            await apiClient.post('/auth/register', {
                firstName,
                email,
                password,
            });
            navigate('/login');
        } catch (err) {
            setError((err as Error).message || "Échec de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mt-5 shadow-sm">
            <Card.Body>
                <h2 className="text-center mb-4">Inscription</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" id="firstName">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Form.Group>
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
                    <Form.Group className="mb-3" id="password-confirm">
                        <Form.Label>Confirmer le mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        disabled={loading}
                        className="w-100 mt-3"
                        type="submit"
                    >
                        S&apos;inscrire
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    Déjà un compte ? <Link to="/login">Se connecter</Link>
                </div>
            </Card.Body>
        </Card>
    );
};
