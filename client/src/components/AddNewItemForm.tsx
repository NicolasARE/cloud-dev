import { useState, FormEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { CreateItemDto, TodoItemDto } from '../dtos/Item.dtos';

interface AddItemFormProps {
    onNewItem: (item: TodoItemDto) => void;
}

export function AddItemForm({ onNewItem }: AddItemFormProps) {
    const [newItem, setNewItem] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submitNewItem = (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const createDto: CreateItemDto = { name: newItem };

        const options = {
            method: 'POST',
            body: JSON.stringify(createDto),
            headers: { 'Content-Type': 'application/json' },
        };

        fetch('/api/items', options)
            .then((r) => r.json())
            .then((item: TodoItemDto) => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
            });
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
                    disabled={!newItem.length}
                    className={submitting ? 'disabled' : ''}
                >
                    {submitting ? 'Adding...' : 'Add Item'}
                </Button>
            </InputGroup>
        </Form>
    );
}
