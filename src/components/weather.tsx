import React, { useState, useEffect } from 'react';
import axios from 'axios';
import weatherConfig from '@/config/weatherConfig'; // Import configuration

const Weather: React.FC = () => {
    const { apiKey, coordinates, apiUrl, units } = weatherConfig;

    const [weatherData, setWeatherData] = useState<any>(null);
    const [dailyForecast, setDailyForecast] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const getWeatherEmoticon = (description: string) => {
        if (description.includes('rain')) return '🌧️';
        if (description.includes('cloud')) return '☁️';
        if (description.includes('clear')) return '☀️';
        if (description.includes('snow')) return '❄️';
        return '🌡️';
    };

    const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(apiUrl, {
                params: {
                    lat: coordinates.lat,
                    lon: coordinates.lon,
                    appid: apiKey,
                    units: units,
                },
            });
            const data = response.data;
            setWeatherData(data);

            const processedForecast = processDailyForecast(data.list);
            setDailyForecast(processedForecast);
        } catch (err) {
            setError('Fehler beim Abrufen der Wetterdaten');
        } finally {
            setLoading(false);
        }
    };

    const processDailyForecast = (list: any[]) => {
        const forecastMap: Record<string, { min: number; max: number; icon: string; rainProb: number }> = {};

        list.forEach((entry) => {
            const date = new Date(entry.dt * 1000).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' });

            if (!forecastMap[date]) {
                forecastMap[date] = {
                    min: Math.round(entry.main.temp),
                    max: Math.round(entry.main.temp),
                    icon: entry.weather[0].icon,
                    rainProb: entry.pop ? Math.round(entry.pop * 100) : 0,
                };
            } else {
                forecastMap[date].min = Math.min(forecastMap[date].min, Math.round(entry.main.temp));
                forecastMap[date].max = Math.max(forecastMap[date].max, Math.round(entry.main.temp));
            }
        });

        return Object.entries(forecastMap).map(([date, values]) => ({
            date,
            ...values,
        }));
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleString('de-DE', {
            weekday: 'short',
            day: 'numeric',
            month: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    useEffect(() => {
        fetchWeatherData();
    }, []);

    const handleWidgetClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="font-sans">
            {loading ? (
                <p className="text-xs text-gray-500">Lädt...</p>
            ) : error ? (
                <p className="text-red-500 text-xs">{error}</p>
            ) : (
                weatherData && (
                    <div
                        onClick={handleWidgetClick}
                        className="cursor-pointer text-left text-xs text-gray-800 rounded-md hover:shadow-lg transition-shadow w-44"
                    >
                        <p className="font-semithin dark:text-white">
                            {weatherData.city.name} <span className="">, {getCurrentTime()}</span>
                        </p>
                        <p className="font-thin dark:text-white">
                            {Math.round(weatherData.list[0].main.temp)}°C , in 3h {Math.round(weatherData.list[1].main.temp)}°C {getWeatherEmoticon(weatherData.list[0].weather[0].description)}
                        </p>
                        <p className="font-thin dark:text-white">Regen erwartet: {weatherData.list[1].rain?.['3h'] ? `${weatherData.list[1].rain['3h']}mm` : 'Nein'}</p>
                    </div>
                )
            )}

            {showModal && weatherData && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Detailierte Wetterinformationen für {weatherData.city.name}
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p><strong>Aktuelle Temperatur:</strong> {Math.round(weatherData.list[0].main.temp)}°C</p>
                                <p><strong>Luftfeuchtigkeit:</strong> {weatherData.list[0].main.humidity}%</p>
                                <p><strong>Wind:</strong> {weatherData.list[0].wind.speed} km/h</p>
                                <p><strong>Sichtweite:</strong> {weatherData.list[0].visibility} m</p>
                            </div>
                            <div>
                                <p><strong>Wetter:</strong> {weatherData.list[0].weather[0].description}</p>
                                <p><strong>Bewölkung:</strong> {weatherData.list[0].clouds.all}%</p>
                                <p><strong>Druck:</strong> {weatherData.list[0].main.pressure} hPa</p>
                                <p><strong>Regenwahrscheinlichkeit:</strong> {dailyForecast[0]?.rainProb || 0}%</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-bold mb-2">7-Tage-Vorhersage</h3>
                            <div className="flex overflow-x-auto space-x-4">
                                {dailyForecast.map((day, index) => (
                                    <div
                                        key={index}
                                        className="text-center bg-gray-300 rounded-lg shadow p-4 min-w-[120px]"
                                    >
                                        <p className="font-bold">{day.date}</p>
                                        <img
                                            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                            alt="Weather icon"
                                            className="mx-auto"
                                            style={{ width: '60px', height: '60px' }}
                                        />
                                        <p>Min: {day.min}°C</p>
                                        <p>Max: {day.max}°C</p>
                                        {/* <p>Regenwahrscheinlichkeit: {day.rainProb}%</p> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={handleCloseModal}
                        >
                            Schließen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Weather;
