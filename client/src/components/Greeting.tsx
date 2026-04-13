import { useEffect, useState } from 'react';

export function Greeting() {
    const [greeting, setGreeting] = useState<string>('');

    useEffect(() => {
        fetch('/api/greeting')
            .then((r) => r.json())
            .then((d) => setGreeting(d.greeting));
    }, []);

    if (!greeting) {
        return <div className="text-center p-4">Loading greeting...</div>;
    }

    return <h1 className="text-center m-4">{greeting}</h1>;
}
