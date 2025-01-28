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
        key: "age",
        question: "Alter",
        options: [
            { label: "bis 44 Jahre", points: 0 },
            { label: "45 bis 54 Jahre", points: 2 },
            { label: "55 bis 64 Jahre", points: 3 },
            { label: "65 Jahre und mehr", points: 4 },
        ],
    },
    {
        key: "bmi",
        question: "Body Mass Index (BMI)",
        options: [
            { label: "18.5 bis 25 kg/m² (Normalgewicht)", points: 0 },
            { label: "25.0 bis 29.9 kg/m² (Übergewicht)", points: 1 },
            { label: "über 30.0 kg/m² (Adipositas)", points: 3 },
        ],
    },
    {
        key: "waistCircumference",
        question: "Taillenumfang (unterhalb des Rippenbogens gemessen)",
        options: [
            { label: "Männer: unter 94 cm", points: 0 },
            { label: "Männer: 94 bis 102 cm", points: 3 },
            { label: "Männer: über 102 cm", points: 4 },
            { label: "Frauen: unter 80 cm", points: 0 },
            { label: "Frauen: 80 bis 88 cm", points: 3 },
            { label: "Frauen: über 88 cm", points: 4 },
        ],
    },
    {
        key: "physicalActivity",
        question: "Täglich mindestens 30 Minuten körperliche Aktivität (außer Atem oder ins Schwitzen kommen)",
        options: [
            { label: "Ja", points: 0 },
            { label: "Nein", points: 2 },
        ],
    },
    {
        key: "fruitVegetableIntake",
        question: "Häufigkeit des Früchte- und Gemüse-Verzehrs",
        options: [
            { label: "Täglich", points: 0 },
            { label: "Nicht täglich", points: 1 },
        ],
    },
    {
        key: "medicationForHypertension",
        question: "Regelmäßige Medikamenteneinnahme gegen Bluthochdruck",
        options: [
            { label: "Ja", points: 2 },
            { label: "Nein", points: 0 },
        ],
    },
    {
        key: "highBloodGlucose",
        question: "Hohe Blutzuckerwerte in der Vergangenheit",
        options: [
            { label: "Ja", points: 5 },
            { label: "Nein", points: 0 },
        ],
    },
    {
        key: "familyHistoryDiabetes",
        question: "Erstgradige Blutsverwandte mit einer Diabetes-Diagnose",
        options: [
            { label: "Ja", points: 2 },
            { label: "Nein", points: 0 },
        ],
    },
];
