import { useState, FormEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { useNotification } from '../../application/contexts/useNotification';
import { addItem } from '../../domain/services/addItem.service';
import { AddItemDto, TodoItemDto } from '../../domain/models/Item.model';

interface AddItemFormProps {
    onNewItem: (item: TodoItemDto) => void;
}

export function AddItemForm({ onNewItem }: AddItemFormProps) {
    const [newItem, setNewItem] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { notify } = useNotification();

    const submitNewItem = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const dto: AddItemDto = { name: newItem };

            const item = await addItem(dto);

            onNewItem(item);
            setNewItem('');

            notify({
                message: 'Item ajouté avec succès',
                type: 'success',
            });
        } catch (error) {
            notify({
                message: (error as Error).message,
                type: 'error',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    type="text"
                    placeholder="New Item"
                    aria-label="New item"
                />
                <Button
                    type="submit"
                    variant="success"
                    disabled={!newItem.length || submitting}
                >
                    {submitting ? 'Adding...' : 'Add Item'}
                </Button>
            </InputGroup>
        </Form>
    );
}
