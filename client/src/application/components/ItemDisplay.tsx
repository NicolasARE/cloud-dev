import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons/faCheckSquare';
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare';

import { useNotification } from '../../application/contexts/useNotification';

import { TodoItem } from '../../domain/models/Item.model';
import { updateItem } from '../../domain/services/updateItem.service';
import { deleteItem } from '../../domain/services/deleteItem.service';

import '../assets/ItemDisplay.scss';

interface ItemDisplayProps {
    item: TodoItem;
    onItemUpdate: (item: TodoItem) => void;
    onItemRemoval: (item: TodoItem) => void;
}

export function ItemDisplay({
    item,
    onItemUpdate,
    onItemRemoval,
}: ItemDisplayProps) {
    const [name, setName] = useState(item.name);
    const [isDirty, setIsDirty] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { notify } = useNotification();

    const update = async (toggleChange: boolean = false) => {
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
    };

    const handleConfirm = async () => {
        if (!name.trim()) return;
        await update();
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(item.name);
        setIsDirty(false);
        setIsEditing(false);
    };

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
            <Row className="align-items-center">
                <Col xs={2} className="text-center">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={() => update(true)}
                        aria-label="Item Completion Toggle"
                    >
                        <FontAwesomeIcon
                            icon={item.completed ? faCheckSquare : faSquare}
                        />
                    </Button>
                </Col>

                <Col xs={6}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setIsDirty(e.target.value !== item.name);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleConfirm();
                            } else if (e.key === 'Escape') {
                                handleCancel();
                            }
                        }}
                        readOnly={!isEditing}
                        className={`form-control ${isEditing ? '' : 'form-control-plaintext'} ${isDirty ? 'dirty-input' : ''} ${!name ? 'empty-input' : ''}`}
                        style={isEditing ? {} : { border: 'none', background: 'transparent', boxShadow: 'none', paddingLeft: '0', pointerEvents: 'none' }}
                        autoFocus={isEditing}
                    />
                </Col>

                <Col xs={4} className="text-center remove d-flex justify-content-center align-items-center">
                    {isEditing ? (
                        <>
                            <Button
                                size="sm"
                                variant="success"
                                className="me-2 d-flex align-items-center"
                                onClick={handleConfirm}
                                disabled={!name}
                                aria-label="Confirm Edit"
                            >
                                <FontAwesomeIcon icon={faCheck} className="me-1" /> OK
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="d-flex align-items-center"
                                onClick={handleCancel}
                                aria-label="Cancel Edit"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                size="sm"
                                variant="link"
                                className="me-2"
                                onClick={() => setIsEditing(true)}
                                aria-label="Edit Item"
                            >
                                <FontAwesomeIcon
                                    icon={faPen}
                                    className="text-primary"
                                />
                            </Button>
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
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
