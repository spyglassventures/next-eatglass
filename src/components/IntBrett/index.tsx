// pages/brett.tsx   aka CIRS
import React, { useState } from "react";
import CirsHistory from "@/components/IntBrett/CirsHistory";
import CirsNew from "@/components/IntBrett/CirsNew";
import CirsInstructions from "@/components/IntBrett/CirsInstructions";


interface TabDef {
  name: string;
  label: string;
}

const TABS: TabDef[] = [
  { "name": "erstellen", "label": "Erfassen" },
  { "name": "historie", "label": "Historie" },
  { "name": "anleitung", "label": "Anleitung" },
]
const primaryColor = "#24a0ed";  // ToDo: store in config

const Brett = () => {

  const [activeTab, setActiveTab] = useState(TABS[0].name);

  function isActiveTab(tabName: string) {
    return activeTab === tabName;
  }

  function handleTabClick(tabName: string) {
    setActiveTab(tabName);
  }

  function createTab(tabDef: TabDef) {
    const active = isActiveTab(tabDef.name);
    return (
      <button
        key={tabDef.name}
        onClick={() => handleTabClick(tabDef.name)}
        className={`px-4 py-2 rounded-md transition-colors ${active ? "text-white" : "text-gray-700 hover:bg-gray-200"}`}
        style={{ backgroundColor: active ? primaryColor : "transparent" }}
      >
        {tabDef.label}
      </button>
    );
  }

  // ToDo: inactive tabs are nonexistent: entered Data disappears
  return (
    <div className="p-6 max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: primaryColor }}>
        CIRS Erfassung
      </h1>

      {/* Tab Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          {TABS.map(createTab)}
        </div>
      </div>
      {activeTab === "anleitung" && <CirsInstructions />}
      {activeTab === "historie" && (
        <CirsHistory />
      )}
      {activeTab === "erstellen" && (
        <CirsNew />
      )}
    </div>
  );
};

export default Brett;
