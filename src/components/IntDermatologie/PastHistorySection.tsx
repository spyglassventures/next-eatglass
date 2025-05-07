import React from 'react';
import { FormTabs } from './FormTabs';

type Props = {
    formData: any;
    errors: Record<string, string>;
    onChange: (e: any) => void;
    onSelect: (k: string, v: string) => void;
};

export const PastHistorySection: React.FC<Props> = ({
    formData, errors, onChange, onSelect
}) => (
    <div>
        <label className="font-semibold">
            5. Hautveränderung in der Vergangenheit?
        </label>
        <FormTabs
            options={['ja', 'nein'] as const}
            selected={formData.vergangenheit}
            onSelect={v => onSelect('vergangenheit', v)}
        />
        {errors.vergangenheit && <p className="text-red-600 text-sm">{errors.vergangenheit}</p>}

        {formData.vergangenheit === 'ja' && (
            <textarea
                name="vergangenheitText"
                placeholder="z.B. Ekzem…"
                className={`w-full border p-3 rounded mt-2 ${errors.vergangenheitText ? 'border-red-500' : ''}`}
                value={formData.vergangenheitText}
                onChange={onChange}
            />
        )}
        {errors.vergangenheitText && <p className="text-red-600 text-sm">{errors.vergangenheitText}</p>}
    </div>
);
