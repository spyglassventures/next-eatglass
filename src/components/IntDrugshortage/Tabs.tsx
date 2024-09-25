import React from 'react';

interface TabsProps {
    activeTab: string;
    onChangeTab: (tab: string) => void;
}

const getTabClass = (isActive: boolean) =>
    isActive ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-amber-500';

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChangeTab }) => {
    const tabs = ['Lieferengpass', 'Mutationen'];

    return (
        <div className="flex mb-6 space-x-4">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChangeTab(tab)}
                    className={`px-4 py-2 p-5 rounded transition-colors duration-200 ease-in-out ${getTabClass(activeTab === tab)}`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
