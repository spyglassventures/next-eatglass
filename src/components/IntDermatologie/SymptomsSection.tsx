import React from 'react';
import { Symptom } from '../Dermatologie';
import { FormTabs } from './FormTabs';

type Props = {
    formData: any;
    errors: Record<string, string>;
    onCheckbox: (s: Symptom) => void;
    onSelect: (k: string, v: string) => void;
    onChange: (e: any) => void;
};

export const SymptomsSection: React.FC<Props> = ({
    formData, errors, onCheckbox, onSelect, onChange
}) => (
    <div>
        <label className="font-semibold">
            6. Weitere Vorerkrankungen?
        </label>
        <FormTabs
            options={['ja', 'nein'] as const}
            selected={formData.weitereSymptome}
            onSelect={v => onSelect('weitereSymptome', v)}
        />
        {errors.weitereSymptome && <p className="text-red-600 text-sm">{errors.weitereSymptome}</p>}

        {formData.weitereSymptome === 'ja' && (
            <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {(['Fieber', 'Bluthochdruck', 'Diabetes', 'Asthma', 'Migräne', 'andere'] as Symptom[]).map(s => (
                        <label key={s} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={formData.vorerkrankungen.includes(s)}
                                onChange={() => onCheckbox(s)}
                            />
                            {s}
                        </label>
                    ))}
                </div>
                {errors.vorerkrankungen && <p className="text-red-600 text-sm">{errors.vorerkrankungen}</p>}
                <textarea
                    name="vorerkrankungenText"
                    placeholder="Weitere Angaben…"
                    className="w-full border p-3 rounded mt-2"
                    value={formData.vorerkrankungenText}
                    onChange={onChange}
                />
            </>
        )}
    </div>
);
