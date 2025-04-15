import React, { useState } from 'react';

// Typisierung für Nachrichten
type Message = {
    sender: string;
    message: string;
    time: string;
    date: string;
    comments: { text: string; isNew: boolean }[];
};

const dummyMessages: Message[] = [
    {
        sender: 'Dr. Müller (Arzt)',
        message: 'Bitte nicht vergessen: Morgen ist QM-Meeting um 09:00 Uhr. Agenda sperren.',
        time: '08:15',
        date: '15.04.2025',
        comments: [
            { text: 'Wird erledigt - DM', isNew: true },
            { text: 'Ich bringe den Kaffee - FK', isNew: false },
        ],
    },
    {
        sender: 'Frau Keller (MPA)',
        message: 'Hatte heute Fehlermeldung beim Laborwerte ins System geladen. Wer kümmert sich, Hotline anrufen',
        time: '08:17',
        date: '15.04.2025',
        comments: [
            { text: 'Ich übernehme das - HS', isNew: true },
        ],
    },
    {
        sender: 'Herr Schmid (Arzt)',
        message: 'Wer übernimmt heute die Vertretung für Susanne am Ostersonntag?',
        time: '08:18',
        date: '15.04.2025',
        comments: [],
    },
];

const PraxisChat = () => {
    const [messages, setMessages] = useState<Message[]>(dummyMessages);
    const [newMessage, setNewMessage] = useState('');
    const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});

    const handleSend = () => {
        if (!newMessage.trim()) return;
        const now = new Date();
        const newEntry: Message = {
            sender: 'Ich',
            message: newMessage,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: now.toLocaleDateString('de-CH'),
            comments: [],
        };
        setMessages([...messages, newEntry]);
        setNewMessage('');
    };

    const handleCommentSend = (index: number) => {
        const text = commentInputs[index];
        if (!text || !text.trim()) return;
        const updatedMessages = [...messages];
        updatedMessages[index].comments.push({ text, isNew: true });
        setMessages(updatedMessages);
        setCommentInputs({ ...commentInputs, [index]: '' });
    };

    const handleEdit = (index: number) => {
        const updatedText = prompt('Nachricht bearbeiten:', messages[index].message);
        if (updatedText !== null) {
            const updatedMessages = [...messages];
            updatedMessages[index].message = updatedText;
            setMessages(updatedMessages);
        }
    };

    const handleDelete = (index: number) => {
        if (confirm('Nachricht wirklich löschen?')) {
            const updatedMessages = [...messages];
            updatedMessages.splice(index, 1);
            setMessages(updatedMessages);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <div className="max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">🩺 Praxis-Chat</h1>

                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 h-[70vh] flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {messages.map((msg, idx) => (
                            <div key={idx} className="relative bg-gray-100 p-4 rounded-lg border border-gray-300">
                                {msg.comments.some(c => c.isNew) && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {msg.comments.filter(c => c.isNew).length}
                                    </div>
                                )}
                                <div className="text-sm text-gray-500">
                                    {msg.date} – {msg.time} – <span className="font-semibold text-gray-700">{msg.sender}</span>
                                </div>
                                <div className="text-base text-gray-900 mb-2 whitespace-pre-wrap">{msg.message}</div>

                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={() => handleEdit(idx)}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Bearbeiten
                                    </button>
                                    <button
                                        onClick={() => handleDelete(idx)}
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        Löschen
                                    </button>
                                </div>

                                <div className="mt-2 space-y-1">
                                    {msg.comments.map((c, i) => (
                                        <div key={i} className={`text-sm ${c.isNew ? 'font-semibold text-red-600' : 'text-gray-700'}`}>
                                            💬 {c.text}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-2 flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Kommentar + Kürzel (z.B. Wird erledigt - DM)"
                                        value={commentInputs[idx] || ''}
                                        onChange={(e) => setCommentInputs({ ...commentInputs, [idx]: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSend(idx)}
                                        className="flex-1 text-sm p-2 rounded-md border border-gray-300 bg-white text-black"
                                    />
                                    <button
                                        onClick={() => handleCommentSend(idx)}
                                        className="bg-black text-white text-sm px-4 py-1.5 rounded-md hover:opacity-80"
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-1 p-2 rounded-md border border-gray-300 bg-white text-black"
                            placeholder="Nachricht eingeben..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-black text-white px-4 py-2 rounded-md hover:opacity-80"
                        >
                            Senden
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PraxisChat;