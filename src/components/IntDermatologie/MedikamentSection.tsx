import React from 'react';

interface Medikament {
    name: string;
    frequenz: string;
    seit: string;
}

interface Props {
    medikamente: Medikament[];
    setMedikamente: (meds: Medikament[]) => void;
}

const MedikamentSection: React.FC<Props> = ({ medikamente, setMedikamente }) => {
    const handleChange = (index: number, field: keyof Medikament, value: string) => {
        const updated = [...medikamente];
        updated[index][field] = value;
        setMedikamente(updated);
    };

    const addMedikament = () => {
        setMedikamente([...medikamente, { name: '', frequenz: '', seit: '' }]);
    };

    return (
        <div className="mt-4">
            <h4 className="font-semibold mb-2">Medikamente</h4>
            {medikamente.map((med, index) => (
                <div key={index} className="mb-4 border p-3 rounded">
                    <input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                        placeholder="Name des Medikaments"
                        className="w-full border p-2 rounded mb-2"
                    />
                    <select
                        value={med.frequenz}
                        onChange={(e) => handleChange(index, 'frequenz', e.target.value)}
                        className="w-full border p-2 rounded mb-2"
                    >
                        <option value="">Frequenz wählen</option>
                        <option value="mehrmals täglich">mehrmals täglich</option>
                        <option value="1x/Tag (regelmässig)">1x/Tag (regelmässig)</option>
                        <option value="häufiger als 1x/Woche">häufiger als 1x/Woche</option>
                        <option value="seltener als 1x/Woche">seltener als 1x/Woche</option>
                    </select>
                    <select
                        value={med.seit}
                        onChange={(e) => handleChange(index, 'seit', e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Seit wann?</option>
                        <option value="seit wenigen Tagen">seit wenigen Tagen</option>
                        <option value="seit über einer Woche">seit über einer Woche</option>
                        <option value="seit über einem Monat">seit über einem Monat</option>
                        <option value="seit über einem Jahr">seit über einem Jahr</option>
                        <option value="seit dem TT.MM.JJJJ">seit dem TT.MM.JJJJ</option>
                    </select>
                </div>
            ))}
            <button
                type="button"
                onClick={addMedikament}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                + Medikament hinzufügen
            </button>
        </div>
    );
};

export default MedikamentSection;
