import React, { useState } from 'react';
import { saveAs } from 'file-saver';

const validateFields = (entries, isMigel) => {
    const fieldPatterns = {
        RECA: /^\d{0,2}$/,
        CMUT: /^[123]?$/,
        PHAR: /^\d{0,7}$/,
        ABEZ: /^.{0,50}$/,
        PRMO: /^\d{0,6}$/,
        PRPU: /^\d{0,6}$/,
        CKZL: /^\d{0,1}$/,
        CLAG: /^[0-4]?$/,
        CIKS: /^.{0,1}$/,
        ITHE: /^.{0,7}$/,
        CEAN: /^\d{0,13}$/,
        CMWS: /^[123]?$/,
    };

    const errors = {};

    entries.forEach((entry, rowIndex) => {
        if (Object.values(entry).some((val) => val)) {
            Object.keys(fieldPatterns).forEach((key) => {
                if (!isMigel && key === 'CMWS') return; // Skip MWSt for Drugs
                if (!fieldPatterns[key].test(entry[key] || '')) {
                    if (!errors[rowIndex]) {
                        errors[rowIndex] = [];
                    }
                    errors[rowIndex].push(key);
                }
            });
        }
    });

    return errors;
};

const padField = (value, length, padChar = '0', isText = false) => {
    if (isText) {
        return value.toString().padEnd(length, ' ').slice(0, length);
    } else {
        return value.toString().padStart(length, padChar).slice(0, length);
    }
};

const FormRow = ({ rowIndex, formData, setFormData, isMigel, errorFields }) => {
    const fields = [
        { label: 'Recordart (Laenge: 2)', field: 'RECA', length: 2, example: '01' },
        { label: 'Mutationscode (Laenge: 1)', field: 'CMUT', length: 1, example: '1 = neu, 2 = Update, 3 = ausser Handel' },
        { label: 'Pharmacode (Laenge: 7)', field: 'PHAR', length: 7, example: '1234567' },
        { label: 'Artikelbezeichnung (Laenge: 50)', field: 'ABEZ', length: 50, example: 'Paracetamol 500mg' },
        { label: 'Arztpreis (MO-Preis) (Laenge: 6)', field: 'PRMO', length: 6, example: '10570 = 105.70 CHF ' },
        { label: 'Publikumspreis (Laenge: 6)', field: 'PRPU', length: 6, example: '12570 = 125.70 CHF ' },
        { label: 'Kassenzulässigkeit (Laenge: 1)', field: 'CKZL', length: 1, example: '1' },
        { label: 'Lagerart (Laenge: 1)', field: 'CLAG', length: 1, example: '0 = keine Einschränkung, 1 = Lagerung im Kuehlschrank, 2 = Lagerung im Gefrierraum, 3 = BTM, 4 = Gift' },
        { label: 'IKS-Listencode (Laenge: 1)', field: 'CIKS', length: 1, example: 'A - Z, gemaess IKS Liste' },
        { label: 'Index-Therapeutikus (Laenge: 7)', field: 'ITHE', length: 7, example: 'THER001, inklusive Ergaenzungen' },
        { label: 'EAN-Code (Laenge: 13)', field: 'CEAN', length: 13, example: '1234567890123' },
        ...(isMigel ? [{ label: 'Mehrwertsteuer-Code (Laenge: 1)', field: 'CMWS', length: 1, example: '1' }] : []),
    ];

    const handleChange = (e, field) => {
        const updatedData = [...formData];
        updatedData[rowIndex][field] = e.target.value;
        setFormData(updatedData);
    };

    return (
        <div className="grid grid-cols-12 gap-4 mb-4 border-b border-gray-300 pb-4">
            {fields.map(({ label, field, example }) => (
                <div key={field} className="col-span-3">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                        {label}
                    </label>
                    <p className="text-xs text-gray-500 mb-1">z.B.: {example}</p>
                    <input
                        type="text"
                        placeholder={label}
                        maxLength={label.includes('50') ? 50 : undefined}
                        className={`p-2 border rounded w-full ${errorFields[rowIndex]?.includes(field) ? 'border-red-500' : ''
                            }`}
                        value={formData[rowIndex][field] || ''}
                        onChange={(e) => handleChange(e, field)}
                    />
                    {errorFields[rowIndex]?.includes(field) && (
                        <p className="text-red-500 text-sm">Ungültiges Format</p>
                    )}
                </div>
            ))}
        </div>
    );
};

const StammdatenIGM = () => {
    const [drugsData, setDrugsData] = useState([{}, {}, {}]);
    const [migalData, setMigalData] = useState([{}, {}, {}]);
    const [errorFields, setErrorFields] = useState({});

    const handleDownload = (data, filename, isMigel) => {
        const errors = validateFields(data, isMigel);
        if (Object.keys(errors).length > 0) {
            setErrorFields(errors);
            return;
        }
        setErrorFields({});
        const content = data
            .filter((entry) => Object.values(entry).some((val) => val))
            .map((entry) => {
                const row = [
                    padField(entry.RECA || '', 2),
                    padField(entry.CMUT || '', 1),
                    padField(entry.PHAR || '', 7),
                    padField(entry.ABEZ || '', 50, ' ', true),
                    padField(entry.PRMO || '', 6),
                    padField(entry.PRPU || '', 6),
                    padField(entry.CKZL || '', 1),
                    padField(entry.CLAG || '', 1),
                    padField(entry.CIKS || '', 1),
                    padField(entry.ITHE || '', 7),
                    padField(entry.CEAN || '', 13),
                    isMigel ? padField(entry.CMWS || '', 1) : '',
                ].join('');

                // Ensure row is exactly 96 characters
                return row.padEnd(96, ' ');
            })
            .join('\n');

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, filename);
    };

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-6">Stammdaten Formulare</h1>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Arzneimittel (Drugs)</h2>
                {drugsData.map((_, index) => (
                    <FormRow
                        key={index}
                        rowIndex={index}
                        formData={drugsData}
                        setFormData={setDrugsData}
                        isMigel={false}
                        errorFields={errorFields}
                    />
                ))}
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handleDownload(drugsData, 'drugs_stamm.dat', false)}
                >
                    Arzneimittel .dat Datei herunterladen
                </button>
            </div>
        </div>
    );
};

export default StammdatenIGM;
