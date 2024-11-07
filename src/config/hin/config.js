// src/config/hin/config.js

const hinConfig = {
    showDownloadButtons: false,
    downloadButtons: {
        csv: {
            label: 'Download CSV',
            initialBgColor: 'bg-transparent',
            textColor: 'text-primary',
            hoverBgColor: 'hover:bg-primary',
            hoverTextColor: 'hover:text-white',
            focusRingColor: 'focus:ring-primary',
            shadow: 'shadow-none',
            hoverShadow: 'hover:shadow-btn-hover',
        },
        excel: {
            label: 'Download Excel',
            initialBgColor: 'bg-transparent',
            textColor: 'text-primary',
            hoverBgColor: 'hover:bg-primary',
            hoverTextColor: 'hover:text-white',
            focusRingColor: 'focus:ring-primary',
            shadow: 'shadow-none',
            hoverShadow: 'hover:shadow-btn-hover',
        },
        iconColor: 'text-primary',
    },
    randomZipCodeButton: {
        show: false,
        label: 'Download Random Zip Code',
        initialBgColor: 'bg-transparent',
        textColor: 'text-primary',
        hoverBgColor: 'hover:bg-primary',
        hoverTextColor: 'hover:text-white',
        focusRingColor: 'focus:ring-primary',
        shadow: 'shadow-none',
        hoverShadow: 'hover:shadow-btn-hover',
    },
    labels: {
        optionalFilter: 'Filter (Optional)',
        cityPlaceholder: 'Stadt eingeben',
        cantonPlaceholder: 'Kanton eingeben',
        specialtyPlaceholder: 'Fachgebiet eingeben',
        resultsHeading: 'Ergebnisse',
        noResultsFound: 'Keine Ergebnisse gefunden',
        noResultsOrSearchYet: 'Keine Ergebnisse oder Suche noch nicht erfolgt. Ggf. Suchbegriff anpassen. Klicken Sie Suchen um die Suchergebnisse hier anzuzeigen.',
        legendHeading: 'Legende:',
        legendCopyInfo: '- Kopieren Sie die Informationen dieses Arztes',
        legendCopyRow: '- Kopieren Sie der Zeile',
        legendCall: '- Anrufen (Skype, Teams, Facetime, Telefon-App öffnet)',
        legendEmail: '- E-Mail senden (z.B. Outlook)',
        legendGoogleMaps: '- Auf Google Maps anzeigen',
        legendVCF: 'VCF - Kontakt als VCF herunterladen (zum Hinzufügen in Ihrem Adressbuch)',
    },
};

export default hinConfig;
