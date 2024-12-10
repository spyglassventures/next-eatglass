'use client';

import { useState } from 'react';
import Image from 'next/image';
import countries from './countriesData';

const CountryDropdown = () => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedGoogleCountry, setSelectedGoogleCountry] = useState('');

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedCountry(selectedValue);
        if (selectedValue) {
            window.open(selectedValue, '_blank');
        }
    };

    const handleGoogleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCountryLabel = event.target.value;
        setSelectedGoogleCountry(selectedCountryLabel);
        if (selectedCountryLabel) {
            const searchQuery = `https://www.google.com/search?q=Reise-+und+Sicherheitshinweise,+Impfung,+Gesundheit+${encodeURIComponent(selectedCountryLabel)}`;
            window.open(searchQuery, '_blank');
        }
    };

    return (
        <div className="pt-5 pb-5">
            <div className="w-4/6 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                <table className="w-full border-spacing-0">
                    <tbody>
                        {/* Row for Google Dropdown */}
                        <tr>
                            <td className="w-[200px] align-middle text-black dark:text-white">
                                Websuche Reisehinweise:
                            </td>
                            <td className="w-[40px] align-middle">
                                <Image src="/images/brands/google.png" alt="Google Logo" width={16} height={16} />
                            </td>
                            <td className="align-middle">
                                <select
                                    id="googleCountryDropdown"
                                    value={selectedGoogleCountry}
                                    onChange={handleGoogleSelectChange}
                                    className="dropdown-select w-4/6 pl-1 py-1 border border-gray-300 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    <option value="">Google - Bitte wählen Sie ein Land</option>
                                    {countries.map((country, index) => (
                                        <option key={index} value={country.label}>
                                            {country.label}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        {/* Row for EDA Dropdown */}
                        <tr>
                            <td className="w-[200px] align-middle text-black dark:text-white">
                                Aktuelle Reisehinweise:
                            </td>
                            <td className="w-[40px] align-middle">
                                <Image src="/images/brands/ed.png" alt="EDA Logo" width={16} height={16} />
                            </td>
                            <td className="align-middle">
                                <select
                                    id="countryDropdown"
                                    value={selectedCountry}
                                    onChange={handleSelectChange}
                                    className="dropdown-select w-4/6 pl-1 py-1 border border-gray-300 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    <option value="">EDA - Bitte wählen Sie ein Land</option>
                                    {countries.map((country, index) => (
                                        <option key={index} value={country.value}>
                                            {country.label}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>

                        {/* Row for Auswärtiges Amt Link */}
                        <tr>
                            <td></td>
                            <td>
                                <Image src="/images/brands/aamt.png" alt="Auswärtiges Amt Logo" width={16} height={16} />
                            </td>
                            <td>
                                <a
                                    href="https://www.auswaertiges-amt.de/de/ReiseUndSicherheit/reise-und-sicherheitshinweise"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-4/6 pl-2 py-1 text-black bg-white border border-gray-300 rounded inline-block hover:bg-gray-100 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    AAMT - Auswärtiges Amt Reisehinweise
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CountryDropdown;
