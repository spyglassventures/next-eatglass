import React, { useEffect, useState } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import axios from 'axios';
import dropdownOptions from '../../config/ai/ai_forms/ki_formulare_dropdown.json';

export default function GenDocxStructure({ formData, formFields, docConfig }) {
    const [internalFormData, setInternalFormData] = useState(formData);
    const [dropdownData, setDropdownData] = useState({});

    useEffect(() => {
        if (formData) {
            setInternalFormData(formData);
        }

        // Initialize dropdown data with default options (first option for each dropdown)
        const initialDropdownData = dropdownOptions.dropdowns.reduce((acc, dropdown) => {
            acc[dropdown.variable] = dropdown.options[0].value;  // Set the first option's value as default
            return acc;
        }, {});

        setDropdownData(initialDropdownData);
    }, [formData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInternalFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDropdownData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const generateDocument = async () => {
        try {
            const response = await axios.get(docConfig.docTemplatePath, {
                responseType: 'arraybuffer',
            });

            const zip = new PizZip(response.data);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            // Merge both form and dropdown data
            const fullData = { ...internalFormData, ...dropdownData };
            doc.setData(fullData);
            doc.render();

            const updatedDoc = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            saveAs(updatedDoc, docConfig.saveFileName);
        } catch (error) {
            console.error('Error generating document:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Formular Vorschau</h2>
            <h3 className="text-1xl mb-4">
                Sollte der Copilot Text unvollständig sein oder von der gewohnten Struktur abweichen, dann bitte die komplette Seite neu laden und erneut probieren.
            </h3>

            <form className="grid grid-cols-1 gap-4" onSubmit={(e) => { e.preventDefault(); generateDocument(); }}>
                {formFields.map((field) => (
                    <div key={field.id}>
                        <h3 className="text-xl font-semibold mb-4">{field.label}</h3>
                        <textarea
                            name={field.id}
                            placeholder={internalFormData[field.id] || field.placeholder}
                            value={internalFormData[field.id]}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                ))}

                {/* Title for dropdown section */}
                <h3 className="text-xl font-semibold mb-4">Zusätzliche Angaben</h3>

                {/* Render Dropdowns */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {dropdownOptions.dropdowns.map((dropdown, idx) => (
                        <div key={idx}>
                            <label className="block text-sm font-medium mb-2" htmlFor={dropdown.variable}>{dropdown.label}</label>
                            <select
                                name={dropdown.variable}
                                value={dropdownData[dropdown.variable]}
                                onChange={handleDropdownChange}
                                className="border p-2 rounded w-full"
                            >
                                {dropdown.options.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Übertragen in Word
                </button>
            </form>
        </div>
    );
}