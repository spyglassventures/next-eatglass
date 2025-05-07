import React from 'react';
import FormTabs from './FormTabs';

type Props = {
    formData: Record<string, any>;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSelect: (key: string, val: string) => void;
};

const HautproblemSection: React.FC<Props> = ({
    formData,
    errors,
    onChange,
    onSelect,
}) => (
    <>
        {/* Frage 1 */}
        <div>
            <label className="font-semibold">1. Hautproblem:</label>
            <textarea
                name="hautproblem"
                maxLength={1500}
                className={`w-full border p-3 rounded ${errors.hautproblem ? 'border-red-500' : ''
                    }`}
                value={formData.hautproblem}
                onChange={onChange}
            />
            {errors.hautproblem && (
                <p className="text-red-600 text-sm">{errors.hautproblem}</p>
            )}
        </div>

        {/* Frage 2 */}
        <div>
            <label className="font-semibold">2. Seit wann?</label>
            <FormTabs
                options={[
                    '< 3 Tage',
                    '3–7 Tage',
                    '> 1 Woche',
                    '> 1 Monat',
                    '> 1 Jahr',
                ] as const}
                selected={formData.dauer}
                onSelect={(v) => onSelect('dauer', v)}
            />
            {errors.dauer && <p className="text-red-600 text-sm">{errors.dauer}</p>}
        </div>

        {/* Frage 3 */}
        <div>
            <label className="font-semibold">3. Beginn?</label>
            <FormTabs
                options={['plötzlich', 'langsam', 'weiß ich nicht'] as const}
                selected={formData.beginn}
                onSelect={(v) => onSelect('beginn', v)}
            />
            {errors.beginn && <p className="text-red-600 text-sm">{errors.beginn}</p>}
        </div>
    </>
);

export default HautproblemSection;
