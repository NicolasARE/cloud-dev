import { useCallback, useEffect, useState } from 'react';
import { AddItemForm } from './AddNewItemForm';
import { ItemDisplay } from './ItemDisplay';
import { TodoItem } from '../../domain/models/Item.model';
import { getItems } from '../../domain/services/getItem.service';

export function TodoListCard() {
    const [items, setItems] = useState<TodoItem[] | null>(null);

    useEffect(() => {
        getItems().then(setItems);
    }, []);

    const onNewItem = useCallback(
        (newItem: TodoItem) => {
            if (items) {
                setItems([...items, newItem]);
            }
        },
        [items],
    );

    const onItemUpdate = useCallback(
        (item: TodoItem) => {
            if (items) {
                const index = items.findIndex((i) => i.id === item.id);
                setItems([
                    ...items.slice(0, index),
                    item,
                    ...items.slice(index + 1),
                ]);
            }
        },
        [items],
    );

    const onItemRemoval = useCallback(
        (item: TodoItem) => {
            if (items) {
                const index = items.findIndex((i) => i.id === item.id);
                setItems([...items.slice(0, index), ...items.slice(index + 1)]);
            }
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <>
            <AddItemForm onNewItem={onNewItem} />
            {items.length === 0 && (
                <p className="text-center">{"Pas d'items pour le moment, ajoutez en un ci-dessus !"}</p>
            )}
            {items.map((item) => (
                <ItemDisplay
                    key={item.id}
                    item={item}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </>
    );
}
