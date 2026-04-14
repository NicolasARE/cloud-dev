import { useEffect, useState } from 'react';
import { getGreeting } from '../../domain/services/getGreeting.service';

export function Greeting() {
    const [greeting, setGreeting] = useState<string>('');

    useEffect(() => {
        getGreeting()
            .then((data) => setGreeting(data.greeting))
            .catch(() => setGreeting(''));
    }, []);

    if (!greeting) {
        return <div className="text-center p-4">Loading greeting...</div>;
    }

    return <h1 className="text-center m-4">{greeting}</h1>;
}