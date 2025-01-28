import React, { useState, useEffect } from "react";
import { categories, Category, AnswerOption } from "./categoriesDiabetes";

interface Entry {
    date: string;
    points: number;
    selectedAnswers: Record<string, string>;
}

export default function mcDiabetesScore() {
    const [scores, setScores] = useState<Record<string, number>>(() =>
        categories.reduce((acc, category) => ({ ...acc, [category.key]: 0 }), {})
    );
    const [savedEntries, setSavedEntries] = useState<Entry[]>(() => {
        const savedEntriesData = localStorage.getItem("diabetesSavedEntries");
        return savedEntriesData ? JSON.parse(savedEntriesData) : [];
    });
    const [selectedButtons, setSelectedButtons] = useState<Record<string, string>>(() =>
        categories.reduce((acc, category) => ({ ...acc, [category.key]: "" }), {})
    );

    useEffect(() => {
        localStorage.setItem("diabetesScores", JSON.stringify(scores));
    }, [scores]);

    useEffect(() => {
        localStorage.setItem("diabetesSavedEntries", JSON.stringify(savedEntries));
    }, [savedEntries]);

    useEffect(() => {
        localStorage.setItem("diabetesSelectedButtons", JSON.stringify(selectedButtons));
    }, [selectedButtons]);

    const handleScoreChange = (category: string, value: number, label: string) => {
        setScores((prevScores) => ({
            ...prevScores,
            [category]: value,
        }));
        setSelectedButtons((prevButtons) => ({
            ...prevButtons,
            [category]: label,
        }));
    };

    const saveScores = () => {
        const totalPoints = Object.values(scores).reduce((sum, val) => sum + val, 0);
        const newEntry: Entry = {
            date: new Date().toLocaleString(),
            points: totalPoints,
            selectedAnswers: { ...selectedButtons },
        };
        setSavedEntries((prevEntries) => [newEntry, ...prevEntries]);
    };

    const loadPreviousCalculation = (entry: Entry) => {
        const newScores: Record<string, number> = {};
        for (const category of categories) {
            const selectedLabel = entry.selectedAnswers[category.key];
            const option = category.options.find((opt) => opt.label === selectedLabel);
            newScores[category.key] = option ? option.points : 0;
        }
        setScores(newScores);
        setSelectedButtons(entry.selectedAnswers);
    };

    const deleteEntry = (index: number) => {
        setSavedEntries((prevEntries) => prevEntries.filter((_, i) => i !== index));
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-100 p-4 shadow-md">
                <h2 className="text-lg font-semibold mb-4">Letzte Berechnungen</h2>
                <ul>
                    {savedEntries.map((entry, index) => (
                        <li key={index} className="mb-2 flex items-center">
                            <button
                                className="text-left flex-1 py-2 px-4 bg-blue-100 rounded-lg hover:bg-blue-200"
                                onClick={() => loadPreviousCalculation(entry)}
                            >
                                <strong>{entry.points} Punkte:</strong> {entry.date}
                            </button>
                            <button
                                className="ml-2 text-red-500 hover:text-red-700"
                                onClick={() => deleteEntry(index)}
                            >
                                &times;
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-3/4 bg-white p-6 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-6">
                    Rechner Diabetes Typ 2 Risiko-Test – Version für Fachpersonen
                </h1>

                <div className="grid grid-cols-1 gap-4">
                    {categories.map((category: Category) => (
                        <div key={category.key}>
                            <h2 className="text-lg font-semibold mb-2">{category.question}</h2>
                            <div className="flex gap-2">
                                {category.options.map((option: AnswerOption) => (
                                    <button
                                        key={option.label}
                                        className={`py-2 px-4 rounded-lg ${selectedButtons[category.key] === option.label
                                                ? "bg-gray-700 text-white"
                                                : "bg-gray-300 text-black"
                                            }`}
                                        onClick={() =>
                                            handleScoreChange(category.key, option.points, option.label)
                                        }
                                    >
                                        {option.label}: {option.points} Punkte
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Save Button */}
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-6"
                    onClick={saveScores}
                >
                    Ergebnisse speichern
                </button>
            </div>
        </div>
    );
}
