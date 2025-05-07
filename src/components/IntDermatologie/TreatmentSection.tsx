import React from 'react';
import { FormTabs } from './FormTabs';
import MedikamentSection from './MedikamentSection';

type Props = {
    formData: any;
    errors: Record<string, string>;
    onChange: (e: any) => void;
    onSelect: (key: string, val: string) => void;
    showMed: boolean;
    toggleMed: () => void;
    medikamente: any[];
    setMedikamente: any;
};

export const TreatmentSection: React.FC<Props> = ({
    formData, errors, onChange, onSelect,
    showMed, toggleMed, medikamente, setMedikamente
}) => (
    <div>
        <label className="font-semibold">
            4. Behandlung durchgeführt?
        </label>
        <FormTabs
            options={['ja', 'nein'] as const}
            selected={formData.behandlung}
            onSelect={v => onSelect('behandlung', v)}
        />
        {errors.behandlung && <p className="text-red-600 text-sm">{errors.behandlung}</p>}

        {formData.behandlung === 'ja' && (
            <>
                <textarea
                    name="behandlungText"
                    placeholder="Welche?"
                    className={`w-full border p-3 rounded mt-2 ${errors.behandlungText ? 'border-red-500' : ''}`}
                    value={formData.behandlungText}
                    onChange={onChange}
                />
                {errors.behandlungText && <p className="text-red-600 text-sm">{errors.behandlungText}</p>}

                <button
                    type="button"
                    onClick={toggleMed}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                >
                    {showMed ? 'Medikament verbergen' : 'Medikament hinzufügen'}
                </button>

                {showMed && (
                    <MedikamentSection medikamente={medikamente} setMedikamente={setMedikamente} />
                )}
            </>
        )}
    </div>
);
