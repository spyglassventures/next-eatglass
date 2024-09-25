// components/DrugOrderInstructions.tsx

import React from 'react';
import { useTheme } from 'next-themes';
import config from '@/config/newsLatterBoxConfig.json'; // Import the JSON configuration

const DrugOrderInstructions = () => {
    const { theme } = useTheme();
    const { address, openingHours, holidays, vacations } = config;

    return (
        <div className="relative z-10 rounded-sm bg-white p-8 shadow-three dark:bg-gray-dark sm:p-11 lg:p-8 xl:p-11">
            <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white">
                Hinweise: Wie Medikamente bestellen?
            </h3>

            <ul className="list-disc pl-5 space-y-2 mb-8 text-base text-body-color">
                <li>Füllen Sie das Medikamentenbestellformular mit Ihrem Namen, Vornamen und Geburtsdatum aus.</li>
                <li>Tragen Sie die benötigte Anzahl und Dosierung der Medikamente ein.</li>
                <li>Stellen Sie sicher, dass Sie alle notwendigen Medikamente aufgelistet haben.</li>
                <li>Sie können das ausgefüllte Formular entweder per E-Mail an die Praxis senden oder persönlich in der Praxis abgeben.</li>
                <li>Kontaktieren Sie die Praxis bei Rückfragen telefonisch oder per E-Mail.</li>
                <li>Das Praxisteam wird Ihre Bestellung bearbeiten und Sie informieren, sobald die Medikamente bereit sind.</li>
            </ul>

            <div className="mb-8">
                <h4 className="text-xl font-bold text-black dark:text-white">{address.title}</h4>
                <p className="text-base text-body-color">
                    {address.content.map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    ))}
                </p>
            </div>

            <div className="mb-8">
                <h4 className="text-xl font-bold text-black dark:text-white">{openingHours.title}</h4>
                <div className="text-base text-body-color">
                    <div className="grid grid-cols-[110px_minmax(200px,_1fr)] gap-2">
                        {openingHours.hours.map((hour, index) => (
                            <React.Fragment key={index}>
                                <span>{hour[0]}</span>
                                <span className="font-mono">{hour[1]}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <p className="text-body-color mt-2">{openingHours.note}</p>
            </div>



            <div className="mb-12">
                <h4 className="text-xl font-bold text-black dark:text-white">{holidays.title}</h4>
                <div className="text-sm text-body-color">
                    <p className="mb-2">{holidays.note}</p>
                    <div className="grid grid-cols-2 gap-2">
                        {holidays.content.map((holiday, index) => (
                            <React.Fragment key={index}>
                                <span>{holiday[0]}</span>
                                <span>{holiday[1]}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-12">
                <h4 className="text-xl font-bold text-black dark:text-white">{vacations.title}</h4>
                <div className="text-sm text-body-color">
                    <p className="mb-2">{vacations.note}</p>
                    <div className="grid grid-cols-2 gap-2">
                        {vacations.content.map((vacation, index) => (
                            <React.Fragment key={index}>
                                <span>{vacation[0]}</span>
                                <span>{vacation[1]}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <span className="absolute left-2 top-7">
                    <svg
                        width="57"
                        height="65"
                        viewBox="0 0 57 65"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            opacity="0.5"
                            d="M0.407629 15.9573L39.1541 64.0714L56.4489 0.160793L0.407629 15.9573Z"
                            fill="url(#paint0_linear_1028_600)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_1028_600"
                                x1="-18.3187"
                                y1="55.1044"
                                x2="37.161"
                                y2="15.3509"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop
                                    stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                                    stopOpacity="0.62"
                                />
                                <stop
                                    offset="1"
                                    stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                                    stopOpacity="0"
                                />
                            </linearGradient>
                        </defs>
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default DrugOrderInstructions;
