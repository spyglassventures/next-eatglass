'use client';

import React, { useState, useEffect } from 'react';
import PraeparatSearchForm from '../../PraeparatSearchForm';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface SidebarPanelProps {
    currentTheme: any;
    showPraeparatSearch: boolean;
    examplesData: {
        examples: string[];
        abkuerzungen: string[];
        videoPath: string;
        hinweise: string[];
    };
    handleLiClick: (text: string) => void;
}

const SidebarPanel = ({ currentTheme, showPraeparatSearch, examplesData, handleLiClick }: SidebarPanelProps) => {
    const defaultSections = {
        video: true,
        examples: false,
        hints: false,
    };

    const [openSections, setOpenSections] = useState(defaultSections);

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarSections');
        if (savedState) {
            setOpenSections(JSON.parse(savedState));
        }
    }, []);

    const toggleSection = (section: string) => {
        setOpenSections((prev) => {
            const updatedSections = {
                ...prev,
                [section]: !prev[section],
            };
            localStorage.setItem('sidebarSections', JSON.stringify(updatedSections));
            return updatedSections;
        });
    };

    const getEmbedUrl = (videoPath: string) => {
        if (videoPath.includes("watch?v=")) {
            return videoPath.replace("watch?v=", "embed/");
        }
        if (videoPath.includes("shorts/")) {
            return videoPath.replace("shorts/", "embed/shorts/");
        }
        return videoPath;
    };

    return (
        <div className="w-full md:w-1/3 pl-2 hidden md:block">
            <div
                className={`rounded-md max-h-[500px] overflow-y-auto p-1 ${currentTheme?.container || 'bg-white border dark:bg-zinc-800'
                    }`}
            >
                {/* Video Section */}
                <div className="mb-0">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('video')}
                    >
                        <h3 className="font-semibold">1. Videoanleitung</h3>
                        {openSections.video ? <FaChevronDown /> : <FaChevronRight />}
                    </div>
                    {openSections.video && (
                        <div className="relative w-full overflow-hidden pt-2" style={{ height: '530px' }}>
                            <div className="w-full h-full scale-90 transform origin-top-left overflow-hidden rounded-md">
                                {examplesData.videoPath ? (
                                    <iframe
                                        className="w-full h-[140%] object-cover rounded-md"
                                        style={{ transform: 'translateY(-30%)', objectPosition: 'top center' }}
                                        src={getEmbedUrl(examplesData.videoPath)}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Anleitungsvideo noch nicht erstellt
                                        </p>
                                    </div>
                                )}
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
                <div className="mb-2 pt-2">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('hints')}
                    >
                        <h3 className="font-semibold">3. Hinweise</h3>
                        {openSections.hints ? <FaChevronDown /> : <FaChevronRight />}
                    </div>
                    {openSections.hints && (
                        <div className="mt-2">
                            {examplesData?.hinweise && examplesData.hinweise.length > 0 ? (
                                <ul className="text-sm">
                                    {examplesData.hinweise.map((hinweis, index) => (
                                        <li
                                            key={index}
                                            className="border rounded-md p-2 mb-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {hinweis}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Keine Hinweise bekannt</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidebarPanel;
