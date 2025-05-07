import React from 'react';
import { FormTabs } from './FormTabs';

type Props = {
    formData: any;
    errors: Record<string, string>;
    onChange: (e: any) => void;
    onSelect: (k: string, v: string) => void;
};

export const AllergiesSection: React.FC<Props> = ({
    formData, errors, onChange, onSelect
}) => (
    <div>
        <label className="font-semibold">7. Allergien bekannt?</label>
        <FormTabs
            options={['ja', 'nein'] as const}
            selected={formData.allergien}
            onSelect={v => onSelect('allergien', v)}
        />
        {errors.allergien && <p className="text-red-600 text-sm">{errors.allergien}</p>}

        {formData.allergien === 'ja' && (
            <textarea
                name="allergienText"
                rows={3}
                className={`w-full border p-3 rounded mt-2 ${errors.allergienText ? 'border-red-500' : ''}`}
                value={formData.allergienText}
                onChange={onChange}
            />
        )}
        {errors.allergienText && <p className="text-red-600 text-sm">{errors.allergienText}</p>}
    </div>
);

export default AllergiesSection;