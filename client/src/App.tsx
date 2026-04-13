import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Greeting } from './components/Greeting';
import { TodoListCard } from './components/TodoListCard';

import './index.scss';

function App() {
    return (
        <Container>
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Greeting />
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

export default App;
