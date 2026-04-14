import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons/faCheckSquare';
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare';

import { TodoItem, UpdateItemDto } from '../../domain/models/Item.model';
import { updateItem } from '../../domain/services/updateItem.service';
import { deleteItem } from '../../domain/services/deleteItem.service';

import '../assets/ItemDisplay.scss';

interface ItemDisplayProps {
    item: TodoItem;
    onItemUpdate: (item: TodoItem) => void;
    onItemRemoval: (item: TodoItem) => void;
}

export function ItemDisplay({ item, onItemUpdate, onItemRemoval }: ItemDisplayProps) {
    const toggleCompletion = async () => {
        const updateDto: UpdateItemDto = {
            name: item.name,
            completed: !item.completed,
        };

        const updated = await updateItem(item.id, updateDto);
        onItemUpdate(updated);
    };

    const removeItem = async () => {
        await deleteItem(item.id);
        onItemRemoval(item);
    };

    return (
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>
                <Col xs={2} className="text-center">
                    <Button
                        className="toggles"
                        size="sm"
                        variant="link"
                        onClick={toggleCompletion}
                        aria-label={
                            item.completed
                                ? 'Mark item as incomplete'
                                : 'Mark item as complete'
                        }
                    >
                        <FontAwesomeIcon
                            icon={item.completed ? faCheckSquare : faSquare}
                        />
                    </Button>
                </Col>

                <Col xs={8} className="name">
                    {item.name}
                </Col>

                <Col xs={2} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            className="text-danger"
                        />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}