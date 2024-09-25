import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { categoryIcons } from '../../config/InternalDocuments/Aemtlis'; // Import the categoryIcons mapping

export default function DutyCard({ duty, occurrenceDate }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    const getPriorityIconColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'text-red-500';
            case 'medium':
                return 'text-orange-500';
            case 'low':
                return 'text-green-500';
            default:
                return 'text-gray-300';
        }
    };

    const getFrequencySymbol = (frequency) => {
        switch (frequency) {
            case 'week':
                return 'W';
            case 'month':
                return 'M';
            case 'quarter':
                return 'Q';
            case 'half-year':
                return 'H';
            default:
                return '';
        }
    };

    const CategoryIcon = categoryIcons[duty.category]; // Get the icon for the category

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition relative">
            <div className="flex justify-between">
                <h3 className="font-bold mb-2">{duty.duty}</h3>
                <div className="flex items-center space-x-2">
                    <ExclamationCircleIcon className={`h-6 w-6 ${getPriorityIconColor(duty.priority)}`} />
                    <span className="text-sm font-semibold">{getFrequencySymbol(duty.frequency)}</span>
                    {CategoryIcon && <CategoryIcon className="h-5 w-5 text-gray-500" />} {/* Category Icon */}
                </div>
            </div>
            <p className="text-sm mb-1"><strong>Verantwortlicher:</strong> {duty.person}</p>
            <p className="text-sm mb-1"><strong>Stellvertreter:</strong> {duty.deputy}</p>
            <p className="text-sm mb-1"><strong>Fälligkeitsdatum:</strong> {occurrenceDate.toLocaleDateString('de-DE')}</p>
            <div className="mb-2">
                <div className="flex items-center justify-between cursor-pointer" onClick={toggleDescription}>
                    <span className="font-semibold text-sm text-gray-700">Beschreibung:</span>
                    {isExpanded ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-700" />
                    ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-700" />
                    )}
                </div>
                {isExpanded && (
                    <div className="text-sm text-gray-600 mt-2">
                        {duty.details.find(detail => detail.label === 'Beschreibung')?.value.split('\n').map((line, index) => (
                            <p key={index} className="mb-1">
                                {line.startsWith('-') ? (
                                    <span>&bull; {line.substring(1)}</span>
                                ) : (
                                    <span className="font-semibold">{line}</span>
                                )}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
