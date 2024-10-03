import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapIcon } from '@heroicons/react/24/solid';

type Doctor = {
    name: string;
    speciality: string;
    gln: string;
    phone: string;
    email: string;
    address: string;
};

const HIN = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedSpeciality, setSelectedSpeciality] = useState<string>('');
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [showContactForm, setShowContactForm] = useState<boolean>(false);

    const exampleDoctors: Doctor[] = [
        {
            name: 'Dr. Max Muster',
            speciality: 'Allgemeinmedizin',
            gln: '12345678901',
            phone: '+41 76 123 45 67',
            email: 'max.muster@example.com',
            address: 'Bahnhofstrasse 10, 8001 Zürich',
        },
        {
            name: 'Dr. Anna Beispiel',
            speciality: 'Dermatologie',
            gln: '10987654321',
            phone: '+41 79 987 65 43',
            email: 'anna.beispiel@example.com',
            address: 'Bahnhofpl. 10 A, 3011 Bern',
        },
        {
            name: 'Dr. Peter Schmidt',
            speciality: 'Neurologie',
            gln: '11122334455',
            phone: '+41 78 222 33 44',
            email: 'peter.schmidt@example.com',
            address: 'Clarastrasse 15, 4058 Basel',
        },
    ];

    const handleSearchGLN = () => {
        const foundDoctors = exampleDoctors.filter((doctor) =>
            doctor.gln.includes(searchQuery)
        );
        setDoctors(foundDoctors);
    };

    const handleSearchSpeciality = () => {
        const foundDoctors = exampleDoctors.filter(
            (doctor) => doctor.speciality.toLowerCase() === selectedSpeciality.toLowerCase()
        );
        setDoctors(foundDoctors);
    };

    const handleContactDoctor = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setShowContactForm(true);
    };

    const handleSendMessage = () => {
        alert('Nachricht wurde gesendet (Mockup)');
        setShowContactForm(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-colors duration-500">
            <div className="rounded-sm pt-5 bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:px-8 xl:p-[55px] flex-grow container mx-auto relative">
                {/* HIN Logo with animation */}
                <img
                    src="/images/brands/hin.png"
                    alt="HIN Logo"
                    className="w-32 absolute top-4 right-4 p-3"
                    title="Datenquelle: HIN"
                />

                <div className="pl-6 mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
                        Teilnehmerverzeichnis (Mockup)
                    </h1>
                    <p className="pt-4 text-lg mb-6 text-black dark:text-white">
                        Willkommen im Teilnehmerverzeichnis. Hier können Sie nach Teilnehmern der HIN suchen, Ärzte nach ihrer GLN filtern, nach Fachbereichen suchen und die neuesten Einträge entdecken.
                    </p>
                </div>

                {/* GLN Search */}
                <div className="p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Suche nach GLN</h2>
                    <input
                        type="text"
                        placeholder="GLN eingeben"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-600 transition"
                        onClick={handleSearchGLN}
                    >
                        Suchen (Mockup)
                    </button>
                    {/* GLN Search Results */}
                    <div className="mt-4">
                        {doctors.map((doctor) => (
                            <div
                                key={doctor.gln}
                                className="bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition mb-4"
                            >
                                <h3 className="font-semibold mb-2">
                                    {doctor.name} - {doctor.speciality}
                                </h3>
                                <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">
                                    GLN: {doctor.gln}
                                </p>
                                <div className="flex items-center mb-2">
                                    <PhoneIcon className="h-5 w-5 text-amber-500 mr-2" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {doctor.phone}
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <EnvelopeIcon className="h-5 w-5 text-amber-500 mr-2" />
                                    <button
                                        className="text-amber-500 underline hover:text-amber-600 transition"
                                        onClick={() => handleContactDoctor(doctor)}
                                    >
                                        Nachricht senden
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <MapIcon className="h-5 w-5 text-amber-500 mr-2" />
                                    <a
                                        href={`https://www.google.com/maps?q=${encodeURIComponent(
                                            doctor.address
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-amber-500 underline hover:text-amber-600 transition"
                                    >
                                        Adresse auf Google Maps
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Speciality Search */}
                <div className="p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Suche nach Fachbereich</h2>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        value={selectedSpeciality}
                        onChange={(e) => setSelectedSpeciality(e.target.value)}
                    >
                        <option value="">Wählen Sie einen Fachbereich</option>
                        <option value="Allgemeinmedizin">Allgemeinmedizin</option>
                        <option value="Dermatologie">Dermatologie</option>
                        <option value="Neurologie">Neurologie</option>
                    </select>
                    <button
                        className="bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-600 transition"
                        onClick={handleSearchSpeciality}
                    >
                        Suchen nach Fachbereich (Mockup)
                    </button>
                    {/* Speciality Search Results */}
                    <div className="mt-4">
                        {doctors.map((doctor) => (
                            <div
                                key={doctor.gln}
                                className="bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition mb-4"
                            >
                                <h3 className="font-semibold mb-2">
                                    {doctor.name} - {doctor.speciality}
                                </h3>
                                <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">
                                    GLN: {doctor.gln}
                                </p>
                                <div className="flex items-center mb-2">
                                    <PhoneIcon className="h-5 w-5 text-amber-500 mr-2" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {doctor.phone}
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <EnvelopeIcon className="h-5 w-5 text-amber-500 mr-2" />
                                    <button
                                        className="text-amber-500 underline hover:text-amber-600 transition"
                                        onClick={() => handleContactDoctor(doctor)}
                                    >
                                        Nachricht senden
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <MapIcon className="h-5 w-5 text-amber-500 mr-2" />
                                    <a
                                        href={`https://www.google.com/maps?q=${encodeURIComponent(
                                            doctor.address
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-amber-500 underline hover:text-amber-600 transition"
                                    >
                                        Adresse auf Google Maps
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                {showContactForm && selectedDoctor && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">
                                Nachricht an {selectedDoctor.name} senden
                            </h2>
                            <textarea
                                placeholder="Ihre Nachricht"
                                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                                rows={4}
                            />
                            <button
                                className="bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-600 transition mr-2 mb-3"
                                onClick={handleSendMessage}
                            >
                                Nachricht senden (Mockup)
                            </button>
                            <button
                                className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                                onClick={() => setShowContactForm(false)}
                            >
                                Abbrechen
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HIN;
