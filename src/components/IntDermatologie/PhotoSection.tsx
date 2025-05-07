import React from 'react';

type Props = { patientId: string; };

export const PhotoSection: React.FC<Props> = ({ patientId }) => (
    <div>
        <label className="font-semibold">
            8. Fotos an <b>spyglass@hin.ch</b> mailen
        </label>
        <p className="text-sm text-gray-600">
            Betreff: Hautproblem-ID <span className="font-mono">{patientId}</span>
        </p>
    </div>
);
