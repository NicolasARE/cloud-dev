import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Greeting } from './application/components/Greeting';
import { TodoListCard } from './application/components/TodoListCard';

import './application/assets/index.scss';
import { NotificationProvider } from './application/contexts/NotificationContext';

function App() {
    return (
        <Container>
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <NotificationProvider>
                        <Greeting />
                        <TodoListCard />
                    </NotificationProvider>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
