export interface AnswerOption {
    label: string;
    points: number;
}

export interface Category {
    key: string;
    question: string;
    options: AnswerOption[];
}

export const categories: Category[] = [
    {
        key: "regularChecks",
        question: "Sind mindestens 80% Ihrer Patienten regelmäßig kontrolliert?",
        options: [
            { label: "Ja", points: 10 },
            { label: "Nein", points: 0 },
        ],
    },
    {
        key: "lifestyle",
        question: "Haben mindestens 80% Ihrer Patienten einen BMI kleiner 25 und erhalten eine Beratung zu Gewicht und Bewegung?",
        options: [
            { label: "Ja", points: 5 },
            { label: "Nein", points: 0 },
        ],
    },
    {
        key: "hba1c",
        question: "Wie hoch ist der HbA1c-Wert bei Ihren Patienten?",
        options: [
            { label: "< 9,0% bei ≥85 %", points: 12 },
            { label: "< 8,0% bei ≥60 %", points: 8 },
            { label: "< 7,0% bei ≥40 %", points: 5 },
        ],
    },
    {
        key: "bloodPressure",
        question: "Ist der Blutdruck bei mindestens 65% Ihrer Patienten unter 140/90 mmHg?",
        options: [
            { label: "Ja", points: 15 },
            { label: "Nein", points: 0 },
        ],
    },
    {
        key: "ldl",
        question: "Haben mindestens 63% Ihrer Patienten unter 75 Jahren ein LDL-Cholesterin kleiner 2,60 mmol/l?",
        options: [
            { label: "Ja", points: 10 },
            { label: "Nein", points: 0 },
        ],
    },
    {
        key: "nephropathy",
        question: "Wurde bei mindestens 80% Ihrer Patienten eine Nephropathiesuche durchgeführt?",
        options: [
            { label: "Ja", points: 10 },
            { label: "Nein", points: 0 },
        ],
    },
    {
        key: "eyeExam",
        question: "Haben mindestens 80% Ihrer Patienten eine Augenuntersuchung in den letzten 2 Jahren erhalten?",
        options: [
            { label: "Ja", points: 10 },
            { label: "Nein", points: 0 },
        ],
    },
    {
        key: "footExam",
        question: "Haben mindestens 80% Ihrer Patienten eine Fußuntersuchung erhalten?",
        options: [
            { label: "Ja", points: 10 },
            { label: "Nein", points: 0 },
        ],
    },
];
