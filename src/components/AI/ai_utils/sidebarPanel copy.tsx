'use client';

import React, { useState } from 'react';
import PraeparatSearchForm from '../../PraeparatSearchForm';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface SidebarPanelProps {
    currentTheme: any;
    showPraeparatSearch: boolean;
    examplesData: {
        examples: string[];
        abkuerzungen: string[];
    };
    handleLiClick: (text: string) => void;
}

const SidebarPanel = ({ currentTheme, showPraeparatSearch, examplesData, handleLiClick }: SidebarPanelProps) => {
    const [openSections, setOpenSections] = useState({
        video: true,
        examples: false,
        hints: false,
    });

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <div className="w-full md:w-1/3 pl-2 hidden md:block">
            <div
                className={`rounded-md max-h-[500px] overflow-y-auto p-1 ${currentTheme?.container || 'bg-white border dark:bg-zinc-800'
                    }`}
            >
                {/* Video Section: Scale-90 with Rounded Corners */}
                <div className="mb-0">
                    <div
                        className="flex items-center justify-between cursor-pointer "
                        onClick={() => toggleSection('video')}
                    >
                        <h3 className="font-semibold">1. Videoanleitung</h3>
                        {openSections.video ? <FaChevronDown /> : <FaChevronRight />}
                    </div>
                    {openSections.video && (
                        <div className="relative w-full overflow-hidden pt-2" style={{ height: '530px' }}>
                            {/* Outer wrapper: Keeps rounded corners and no spacing */}
                            <div className="w-full h-full scale-90 transform origin-top-left overflow-hidden rounded-md">
                                {/* Video container */}
                                <video
                                    controls
                                    className="w-full h-[140%] object-cover rounded-md"
                                    style={{ transform: 'translateY(-30%)', objectPosition: 'top center' }}
                                >
                                    <source src="/data/video/AnleitungKostengutsprache.mp4" type="video/mp4" />
                                    Ihr Browser unterstützt dieses Videoformat nicht.
                                </video>
                            </div>

                        </div>

                    )}


                </div>




                {/* Section 2: Beispiele */}
                <div className="mb-2 pt-2">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('examples')}
                    >
                        <h3 className="font-semibold">2. Beispiele für Eingaben</h3>
                        {openSections.examples ? <FaChevronDown /> : <FaChevronRight />}
                    </div>
                    {openSections.examples && (
                        <div className="mt-2">
                            {showPraeparatSearch && <PraeparatSearchForm />}
                            <ul className="text-sm">
                                {examplesData.examples.map((example, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleLiClick(example)}
                                        className="cursor-pointer border rounded-md p-1 mb-1"
                                    >
                                        {example}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Section 3: Hinweise */}
                <div>
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('hints')}
                    >
                        <h3 className="font-semibold">3. Hinweise</h3>
                        {openSections.hints ? <FaChevronDown /> : <FaChevronRight />}
                    </div>
                    {openSections.hints && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Hier könnten wichtige Hinweise oder zusätzliche Informationen stehen.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidebarPanel;
