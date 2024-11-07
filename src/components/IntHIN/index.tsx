import React, { useState, useEffect } from 'react';
import DoctorList from './DoctorList'; // Import DoctorList component
import { Doctor, DetailedDoctor } from './types'; // Import types
import zipToCanton from './swiss_zip_to_canton.json'; // Import cantons
import specialtiesData from './specialities.json'; // Import specialties
import DownloadButton from '../../components/IntHIN/DownloadButton';
import { exportToCSV } from '../../pages/api/exportUtils';
import hinConfig from '../../config/hin/config'; // Import configuration

const HIN = () => {
    const [searchQuery, setSearchQuery] = useState<string>(''); // Custom search query input
    const [doctors, setDoctors] = useState<Doctor[]>([]); // Initial search results
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]); // Filtered search results
    const [detailedDoctors, setDetailedDoctors] = useState<{ [key: string]: DetailedDoctor }>({}); // Detailed data for each doctor
    const [error, setError] = useState<string | null>(null); // Error state
    const [filters, setFilters] = useState<{ city?: string; canton?: string; specialty?: string }>({
        city: '',
        canton: '',
        specialty: '',
    }); // Filters
    const [searchInProgress, setSearchInProgress] = useState<boolean>(false); // Track search progress
    const [randomZipCode, setRandomZipCode] = useState<string | null>(null);

    const specialties = specialtiesData.specialties; // Available specialties from JSON
    const uniqueCantons = Array.from(new Set(Object.values(zipToCanton))); // Unique cantons from ZIP file
    // Random ZIP Code selection
    const getRandomZipCode = () => {
        const zipCodes = Object.keys(zipToCanton);
        const randomIndex = Math.floor(Math.random() * zipCodes.length);
        return zipCodes[randomIndex];
    };

    const handleRandomZipCodeDownload = async () => {
        const zip = getRandomZipCode();
        setRandomZipCode(zip);
        setSearchQuery(zip);
        await handleSearchRandomZip(zip);
        triggerDownload(zip);
    };

    // Trigger the CSV download
    const triggerDownload = (zipCode: string) => {
        if (Object.keys(detailedDoctors).length) {
            exportToCSV(Object.values(detailedDoctors), `DoctorsDetails_${zipCode}`);
        }
    };

    const handleSearchRandomZip = async (zipCode: string) => {
        setSearchInProgress(true);
        setError(null);

        try {
            const response = await fetch(`/api/hinSearch?search=${zipCode}`);
            if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

            const data = await response.json();
            setDoctors(data.results);
            setFilteredDoctors(data.results);

            // Wait for all details to be fetched
            const fetchDetailsPromises = data.results.map(fetchDetailedDoctors);
            await Promise.all(fetchDetailsPromises);

        } catch (err) {
            setError(err.message);
            console.error("Error fetching doctors:", err.message);
        } finally {
            setSearchInProgress(false);
        }
    };



    // Fetch all doctors
    const handleSearch = async () => {
        setSearchInProgress(true); // Set search to in-progress
        setError(null); // Reset any previous errors

        try {
            const response = await fetch(`/api/hinSearch?search=${searchQuery}`); // Dynamic search query

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setDoctors(data.results);
            setFilteredDoctors(data.results); // Initialize filtered results with all doctors

            const resultCount = data.results.length;

            // Check if the threshold has been met
            const threshold = 100; // Example threshold
            if (resultCount > threshold) {
                // Console log or popup logic
                console.log(`More than ${threshold} results found. Only showing the first ${threshold}.`);

                // Optionally show a pop-up to ask for confirmation to load details
                const loadDetails = window.confirm(
                    `Mehr als ${threshold} Ergebnisse wurden gefunden (derzeit auf max. ${resultCount} limitiert). Wollen Sie wirklich so viele Teilnehmer laden? Es kann zu Fehler kommen bei sehr grossen Abfragen.`
                );

                if (!loadDetails) {
                    // Stop here if the user does not want to load details
                    return;
                }
            }

            // Proceed to fetch detailed data for each doctor
            data.results.forEach(fetchDetailedDoctors);

        } catch (err) {
            setError(err.message);
            console.error("Error fetching doctors:", err.message);
        } finally {
            setSearchInProgress(false); // Stop the search progress
        }
    };

    // Fetch detailed data for each doctor (if not already available)
    const fetchDetailedDoctors = async (doctor: Doctor) => {
        if (!detailedDoctors[doctor.integrationId]) {
            try {
                const response = await fetch(`/api/hinDetails?integrationId=${doctor.integrationId}`);
                if (response.ok) {
                    const detailData = await response.json();
                    setDetailedDoctors((prevState) => ({
                        ...prevState,
                        [doctor.integrationId]: detailData,
                    }));
                } else {
                    console.error(`Failed to fetch details for ${doctor.integrationId}`);
                }
            } catch (err) {
                console.error("Error fetching doctor details:", err);
            }
        }
    };


    // Filter doctors based on selected city, canton, and specialty
    const applyFilters = () => {
        let filtered = doctors;

        // Filter by city
        if (filters.city) {
            filtered = filtered.filter((doctor) =>
                doctor.city?.toLowerCase().includes(filters.city!.toLowerCase())
            );
        }

        // Filter by specialty using the detailed doctor information
        if (filters.specialty) {
            filtered = filtered.filter((doctor) => {
                const detailedInfo = detailedDoctors[doctor.integrationId]; // Get detailed info

                if (detailedInfo && detailedInfo.specialistTitles) {
                    return detailedInfo.specialistTitles?.some((specialty) =>
                        specialty.specialityText.toLowerCase().includes(filters.specialty!.toLowerCase())
                    );
                }

                return false; // If no detailed info is available, exclude the doctor
            });
        }

        // Filter by canton using the postalCode from detailed doctor information
        if (filters.canton) {
            filtered = filtered.filter((doctor) => {
                const detailedInfo = detailedDoctors[doctor.integrationId]; // Get detailed info
                if (detailedInfo && detailedInfo.postalCode) {
                    const doctorCanton = zipToCanton[detailedInfo.postalCode]; // Get canton using postalCode
                    console.log(`Doctor: ${doctor.integrationId} - Postal Code: ${detailedInfo.postalCode}, Canton: ${doctorCanton}`);

                    // Check if the doctor's canton matches the entered canton
                    return doctorCanton?.toLowerCase().includes(filters.canton!.toLowerCase());
                }
                return false; // If no postalCode, exclude the doctor
            });
        }

        setFilteredDoctors(filtered);

        // Fetch detailed information for each filtered doctor
        filtered.forEach(fetchDetailedDoctors);
    };

    // Reapply filters whenever the filters change
    useEffect(() => {
        applyFilters();
    }, [filters, doctors, detailedDoctors]);


    const detailedFilteredDoctors = filteredDoctors
        .filter((doctor) => detailedDoctors[doctor.integrationId])
        .map((doctor) => detailedDoctors[doctor.integrationId]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-500">
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">HIN Teilnehmer Suche</h1>
                <input
                    type="text"
                    placeholder="Suchbegriff eingeben (z.B. Name Arzt, Postleitzahl, oder Dorf/Stadt)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-black"
                />

                <button
                    onClick={handleSearch}
                    className="bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-600 transition"
                >
                    Suchen
                </button>
                {hinConfig.randomZipCodeButton.show && (
                    <button
                        onClick={handleRandomZipCodeDownload}
                        className={`${hinConfig.randomZipCodeButton.initialBgColor} ${hinConfig.randomZipCodeButton.textColor} font-semibold py-2 px-4 rounded-lg ${hinConfig.randomZipCodeButton.hoverBgColor} ${hinConfig.randomZipCodeButton.hoverTextColor} transition ml-4`}
                    >
                        {hinConfig.randomZipCodeButton.label}
                    </button>
                )}

                {error && <p className="mt-4 text-red-600">Error: {error}</p>}

                {/* Filters */}
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2">{hinConfig.labels.optionalFilter}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder={hinConfig.labels.cityPlaceholder}
                            value={filters.city || ''}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder={hinConfig.labels.cantonPlaceholder}
                            value={filters.canton || ''}
                            onChange={(e) => setFilters({ ...filters, canton: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder={hinConfig.labels.specialtyPlaceholder}
                            value={filters.specialty || ''}
                            onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                {/* Doctor List */}
                <div className="mt-4">
                    <h2 className="text-lg font-bold mb-2">{hinConfig.labels.resultsHeading}</h2>
                    {filteredDoctors.length > 0 && (
                        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                            <p>
                                {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Ergebnis' : 'Ergebnisse'} gefunden
                            </p>
                            {hinConfig.showDownloadButtons && (
                                <DownloadButton doctors={detailedFilteredDoctors} />
                            )}
                        </div>
                    )}
                    <DoctorList
                        doctors={filteredDoctors}
                        detailedDoctors={detailedDoctors}
                        searchInProgress={searchInProgress}
                        hasSearched={doctors.length > 0 || searchInProgress}
                    />
                </div>

            </div>
        </div>
    );
};

export default HIN;
