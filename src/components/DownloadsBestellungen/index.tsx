"use client";

import React, { useState } from 'react';
import DocumentList from './DocumentList';
import DocumentViewer from './DocumentViewer';
import DrugOrderInstructions from "@/components/DownloadsBestellungen/bestellungSidebar";
import documentsData from '../../config/downloadsBestellungenConfig.json';

const DownloadsBestellungen = () => {
  // Define state hooks
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState<'DE' | 'EN'>('DE'); // Default is Deutsch (DE)
  const [sortKey, setSortKey] = useState<keyof any>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter Documents based on the selected language and search term
  const documents = documentsData.sections.Documents.filter(
    (doc) => {
      const isCorrectLanguage = doc.filename.includes(`-${language.toLowerCase()}`) || (!doc.filename.includes('-de') && !doc.filename.includes('-en'));
      const matchesSearchTerm = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.filename.toLowerCase().includes(searchTerm.toLowerCase());
      return isCorrectLanguage && matchesSearchTerm;
    }
  );

  const handleSortChange = (key: keyof any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedDocuments = documents.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Extract the prominent Medikamentbestellformular
  const medikamentForm = documentsData.sections.Documents.find(doc => doc.name === 'Medikamentbestellformular');

  // Toggle language between DE and EN
  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'DE' ? 'EN' : 'DE'));
  };

  return (
    <section id="downloads" className="overflow-hidden py-6 md:py-10 lg:py-18">
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-4">
          {/* Left Section: Downloads */}
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            {/* Prominent Medikamentbestellformular */}
            {medikamentForm && (
              <div className="mb-8 p-6 bg-white shadow-md rounded-lg dark:bg-gray-dark">
                <h2 className="text-2xl font-bold leading-tight text-black dark:text-white mb-4">{medikamentForm.name}</h2>
                <a
                  href={medikamentForm.path + medikamentForm.filename}
                  download={medikamentForm.filename}
                  className="inline-flex items-center px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
                >
                  Download {medikamentForm.name}
                </a>
              </div>
            )}

            {/* Search and Language Filter */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
              <input
                type="text"
                placeholder="Suche nach Dokumenten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Handle search term input
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4 md:mb-0"
              />

              {/* Sort and Language Filter Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSortChange('name')}
                  className={`px-4 py-2 rounded-lg font-medium ${sortKey === 'name' ? 'bg-amber-500 text-white' : 'bg-gray-400 text-white hover:bg-amber-500'}`}
                >
                  Name {sortKey === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSortChange('filename')}
                  className={`px-4 py-2 rounded-lg font-medium ${sortKey === 'filename' ? 'bg-amber-500 text-white' : 'bg-gray-400 text-white hover:bg-amber-500'}`}
                >
                  Dateiname {sortKey === 'filename' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>

                {/* Language Filter Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`px-4 py-2 rounded-lg ${language === 'DE' ? 'bg-amber-500 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                >
                  {language === 'DE' ? 'nur PDFs in Deutsch' : 'nur PDFs in Englisch'}
                </button>
              </div>
            </div>

            {selectedDocument ? (
              <DocumentViewer selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument} />
            ) : (
              <DocumentList
                documents={sortedDocuments}
                handleSortChange={handleSortChange}
                setSelectedDocument={setSelectedDocument}
              />

            )}
          </div>

          {/* Right Section: Drug Order Instructions */}
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <DrugOrderInstructions />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadsBestellungen;
