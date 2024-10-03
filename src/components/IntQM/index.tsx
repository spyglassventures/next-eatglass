import React from 'react';
import { qmAspekte } from '../../config/qm/qmAspekte';

const QualityManagement = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-secondary to-indigo-100 dark:from-gray-800 dark:to-gray-900 text-black dark:text-white transition-colors duration-500">
            <div className="container mx-auto py-16 px-6 md:px-12 lg:px-24 text-center">
                <h2 className="text-4xl font-extrabold text-indigo-900 dark:text-white mb-8">Qualitätsmanagement in der Praxis - Seite in Arbeit</h2>
                <p className="mb-12 text-lg text-gray-700 dark:text-gray-300">Hier finden Sie die wichtigsten Aspekte des Qualitätsmanagements in einer allgemeinmedizinischen Praxis, um die bestmögliche Versorgung und Betreuung der Patienten zu gewährleisten.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {qmAspekte.map((aspect, index) => (
                        <div
                            key={index}
                            className="p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300"
                        >
                            <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
                                {aspect.title}
                            </h3>
                            <p className="text-md text-gray-600 dark:text-gray-400">
                                {aspect.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QualityManagement;
