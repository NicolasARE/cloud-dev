import { useState } from 'react';
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
    const [name, setName] = useState(item.name);
    const [isDirty, setIsDirty] = useState(false);

    const toggleCompletion = async () => {
        const updated = await updateItem(item.id, {
            name,
            completed: !item.completed,
        });

        setName(updated.name);
        setIsDirty(false);
        onItemUpdate(updated);
    };

    const save = async () => {
        const updated = await updateItem(item.id, {
            name: name.trim(),
            completed: item.completed,
        });

        setName(updated.name);
        setIsDirty(false);
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
                        size="sm"
                        variant="link"
                        onClick={toggleCompletion}
                    >
                        <FontAwesomeIcon
                            icon={item.completed ? faCheckSquare : faSquare}
                        />
                    </Button>
                </Col>

                <Col xs={8}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setIsDirty(e.target.value !== item.name);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.currentTarget.blur();
                                save();
                            }
                        }}
                        onBlur={() => {
                            setIsDirty(name !== item.name);
                        }}
                        className={`form-control ${isDirty ? 'dirty-input' : ''} ${!name ? 'empty-input' : ''}`}
                    />
                </Col>

                <Col xs={2} className="text-center remove">
                    <Button size="sm" variant="link" onClick={removeItem}>
                        <FontAwesomeIcon icon={faTrash} className="text-danger" />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}