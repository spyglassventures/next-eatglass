// components/IntHIN/DownloadButton.tsx
import React from 'react';
import { DetailedDoctor } from '../../components/IntHIN/types';
import { exportToCSV, exportToExcel } from '../../pages/api/exportUtils';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import hinConfig from '../../config/hin/config';

type DownloadButtonProps = {
    doctors: DetailedDoctor[];
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ doctors }) => {
    if (doctors.length === 0 || !hinConfig.showDownloadButtons) return null;

    const handleDownloadCSV = () => {
        exportToCSV(doctors);
    };

    const handleDownloadExcel = () => {
        exportToExcel(doctors);
    };

    const { csv, excel, iconColor } = hinConfig.downloadButtons;

    return (
        <div className="mt-4 flex space-x-4">
            <button
                onClick={handleDownloadCSV}
                className={`flex items-center ${csv.initialBgColor} ${csv.textColor} ${csv.shadow} font-medium py-2 px-3 rounded-md ${csv.hoverBgColor} ${csv.hoverTextColor} ${csv.hoverShadow} transition focus:outline-none focus:ring ${csv.focusRingColor}`}
            >
                <ArrowDownTrayIcon className={`h-5 w-5 mr-2 ${iconColor}`} />
                {csv.label}
            </button>
            <button
                onClick={handleDownloadExcel}
                className={`flex items-center ${excel.initialBgColor} ${excel.textColor} ${excel.shadow} font-medium py-2 px-3 rounded-md ${excel.hoverBgColor} ${excel.hoverTextColor} ${excel.hoverShadow} transition focus:outline-none focus:ring ${excel.focusRingColor}`}
            >
                <ArrowDownTrayIcon className={`h-5 w-5 mr-2 ${iconColor}`} />
                {excel.label}
            </button>
        </div>
    );
};

export default DownloadButton;
