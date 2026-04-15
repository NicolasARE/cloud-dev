import React, { useState } from 'react';
import { Card, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../../domain/utils/apiClient';

export const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();
    const [passwordError, setPasswordError] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordMessage('');

        if (newPassword !== newPasswordConfirm) {
            return setPasswordError('Les nouveaux mots de passe ne correspondent pas');
        }

        setLoading(true);

        try {
            await apiClient.put('/auth/password', { oldPassword, newPassword });
            setPasswordMessage('Mot de passe mis à jour avec succès');
            setOldPassword('');
            setNewPassword('');
            setNewPasswordConfirm('');
        } catch (err: any) {
            setPasswordError(err.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Toutes vos notes seront définitivement supprimées.')) {
            try {
                await apiClient.delete('/auth/account');
                logout();
                navigate('/login');
            } catch (err: any) {
                setPasswordError(err.message || 'Erreur lors de la suppression du compte');
            }
        }
    };

    if (!user) return null;

    return (
        <div className="mt-4">
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <h2 className="mb-4">Profil Personnel</h2>
                    <Row className="mb-3">
                        <Col sm={3} className="text-muted">Prénom</Col>
                        <Col>{user.firstName}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={3} className="text-muted">Email</Col>
                        <Col>{user.email}</Col>
                    </Row>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                        <Link to="/" className="btn btn-outline-secondary">
                            Retour aux notes
                        </Link>
                        <Button variant="danger" onClick={handleDeleteAccount}>
                            Supprimer mon compte
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Body>
                    <h3>Changer le mot de passe</h3>
                    {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                    {passwordMessage && <Alert variant="success">{passwordMessage}</Alert>}
                    <Form onSubmit={handlePasswordChange}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ancien mot de passe</Form.Label>
                            <Form.Control 
                                type="password" 
                                required 
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nouveau mot de passe</Form.Label>
                            <Form.Control 
                                type="password" 
                                required 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                            <Form.Control 
                                type="password" 
                                required 
                                value={newPasswordConfirm}
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            />
                        </Form.Group>
                        <Button disabled={loading} type="submit" variant="primary">
                            Mettre à jour le mot de passe
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};
