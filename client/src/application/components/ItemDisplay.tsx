import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons/faCheckSquare';
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare';

import { useNotification } from '../../application/contexts/NotificationContext';

import { TodoItem } from '../../domain/models/Item.model';
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

    const { notify } = useNotification();

    const update = async (toggleChange:boolean = false) => {
        try {
            const updated = await updateItem(item.id, {
                name,
                completed: toggleChange ? !item.completed : item.completed,
            });
    
            setName(updated.name);
            setIsDirty(false);
            onItemUpdate(updated);

            notify({
                message: 'Item mis à jour',
                type: 'success',
            });

        } catch (error) {
            notify({
                message: (error as Error).message,
                type: 'error',
            });
        }
    }

    const removeItem = async () => {
        try {
            await deleteItem(item.id);
            onItemRemoval(item);

            notify({
                message: 'Item supprimé',
                type: 'success',
            });
        } catch (error) {
            notify({
                message: (error as Error).message,
                type: 'error',
            });
        }
    };

    return (
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>
                <Col xs={2} className="text-center">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={() => update(true)}
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
                                update();
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