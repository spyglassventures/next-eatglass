const weatherConfig = {
    apiKey: process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || '51f1321835c88d6087140fdf354b6fd3', // Fallback-API-Schlüssel
    coordinates: {
        lat: 47.1914822, // Breitengrad für Altendorf, SZ
        lon: 8.8299043,  // Längengrad für Altendorf, SZ
        // lat: 47.16837, lon: 9.47917 Buchs, SG
    },
    apiUrl: 'https://api.openweathermap.org/data/2.5/forecast',
    units: 'metric',
    styles: {
        widgetFontSize: '10px',
        modalZIndex: 9999, // Sehr hoher z-index
    },
};

export default weatherConfig;
