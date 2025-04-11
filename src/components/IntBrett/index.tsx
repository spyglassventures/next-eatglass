// pages/brett.tsx
import React, { useState, useEffect } from 'react';

type Customer = {
    id: number;
    name: string;
    created_at: string;
};

const Brett = () => {
    const [name, setName] = useState('');
    const [feedback, setFeedback] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/customers');
            const data = await res.json();
            setCustomers(data.customers || []);
        } catch (error) {
            console.error('❌ Fehler beim Laden der Kundenliste:', error);
        }
    };

    const handleInsertCustomer = async () => {
        if (!name.trim()) return setFeedback('⚠️ Bitte einen Namen eingeben.');

        setFeedback('⏳ Speichern...');
        try {
            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Fehler beim Einfügen');

            setFeedback(`✅ Kunde gespeichert: ${data.customer.name}`);
            setName('');
            fetchCustomers();
        } catch (error: any) {
            setFeedback(`❌ Fehler: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-black">
            <h1 className="text-3xl font-bold mb-6">Kundeneinträge</h1>

            <div className="mb-6">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kundennamen eingeben"
                    className="px-4 py-2 rounded border text-black mr-2"
                />
                <button
                    onClick={handleInsertCustomer}
                    className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Speichern
                </button>
                {feedback && <p className="mt-3 text-sm">{feedback}</p>}
            </div>

            <div className="w-full max-w-md">
                <h2 className="text-xl font-semibold mb-2">Gespeicherte Kunden</h2>
                <ul className="space-y-2">
                    {customers.map((c) => (
                        <li
                            key={c.id}
                            className="border rounded p-3 shadow-sm bg-gray-50"
                        >
                            <div className="font-medium">{c.name}</div>
                            <div className="text-sm text-gray-500">
                                {new Date(c.created_at).toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Brett;
