import React from 'react';
import { FormTabs } from './FormTabs';

type Props = {
    dataOption: 'form' | 'card';
    formData: any;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<any>) => void;
    onOptionChange: (opt: 'form' | 'card') => void;
};

export const PatientDataSection: React.FC<Props> = ({
    dataOption, formData, errors, onChange, onOptionChange
}) => (
    <>
        <div className="space-y-4">
            <label className="block font-semibold">Daten übermitteln via:</label>
            <div className="flex gap-4">
                <label><input
                    type="radio"
                    checked={dataOption === 'form'}
                    onChange={() => onOptionChange('form')}
                /> Formular</label>
                <label><input
                    type="radio"
                    checked={dataOption === 'card'}
                    onChange={() => onOptionChange('card')}
                /> Karte</label>
            </div>
            {dataOption === 'form' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['firstName', 'lastName'].map(name => (
                        <div key={name}>
                            <input
                                name={name}
                                placeholder={name === 'firstName' ? 'Vorname' : 'Nachname'}
                                className={`border p-3 rounded w-full ${errors[name] ? 'border-red-500' : ''}`}
                                value={formData[name]}
                                onChange={onChange}
                            />
                            {errors[name] && <p className="text-red-600 text-sm">{errors[name]}</p>}
                        </div>
                    ))}
                    <div>
                        <input
                            type="date"
                            name="dateOfBirth"
                            className={`w-full border p-3 rounded ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                            value={formData.dateOfBirth}
                            onChange={onChange}
                        />
                        {errors.dateOfBirth && <p className="text-red-600 text-sm">{errors.dateOfBirth}</p>}
                    </div>
                    {['insurance', 'insuranceNumber'].map(name => (
                        <div key={name}>
                            <input
                                name={name}
                                placeholder={name === 'insurance' ? 'Versicherung' : 'Versichertennr.'}
                                className={`border p-3 rounded w-full ${errors[name] ? 'border-red-500' : ''}`}
                                value={formData[name]}
                                onChange={onChange}
                            />
                            {errors[name] && <p className="text-red-600 text-sm">{errors[name]}</p>}
                        </div>
                    ))}
                </div>
            )}
            {dataOption === 'card' && (
                <div className="bg-blue-50 p-4 rounded text-blue-900">
                    Bitte Karte gut lesbar fotografieren.
                </div>
            )}
        </div>
    </>
);
