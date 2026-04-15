import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Greeting } from './application/components/Greeting';
import { TodoListCard } from './application/components/TodoListCard';
import { LoginPage } from './application/components/LoginPage';
import { RegisterPage } from './application/components/RegisterPage';
import { ProfilePage } from './application/components/ProfilePage';
import { AppNavbar } from './application/components/AppNavbar';
import { PrivateRoute } from './application/components/PrivateRoute';
import { AuthProvider } from './application/contexts/AuthContext';
import { NotificationProvider } from './application/contexts/NotificationProvider';

import './application/assets/index.scss';

function App() {
    return (
        <Router>
            <AuthProvider>
                <NotificationProvider>
                    <AppNavbar />
                    <Container>
                        <Row>
                            <Col md={{ span: 8, offset: 2 }}>
                                <Routes>
                                    <Route
                                        path="/login"
                                        element={<LoginPage />}
                                    />
                                    <Route
                                        path="/register"
                                        element={<RegisterPage />}
                                    />
                                    <Route element={<PrivateRoute />}>
                                        <Route
                                            path="/"
                                            element={
                                                <>
                                                    <Greeting />
                                                    <TodoListCard />
                                                </>
                                            }
                                        />
                                        <Route
                                            path="/profile"
                                            element={<ProfilePage />}
                                        />
                                    </Route>
                                </Routes>
                            </Col>
                        </Row>
                    </Container>
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
