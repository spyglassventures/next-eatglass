export const favoriteZiffern = {
    grundversorgung: [
        '00.0010', // Konsultation, erste 5 Min.
        '00.0015', // Zuschlag hausärztliche Leistung
        '00.0020', // Konsultation, weitere 5 Min.
        '00.0030', // Konsultation, letzte 5 Min.
        '00.0050', // Psychosoziale Beratung durch Grundversorger, 5 Min.
        '00.0110', // Telefonische Konsultation durch Arzt, erste 5 Min.
        '00.0120', // Telefonische Konsultation durch Arzt, weitere 5 Min.
        '00.0130', // Telefonische Konsultation durch Arzt, letzte 5 Min.
        '00.0510', // Spezifische Beratung durch Grundversorger, 5 Min.
        
        '00.0130', // +Tel. Konsult. durch Az, letzte 5'
        '00.0510', // Spezif. Beratung Grundversorger
    ],
    untersuchungen: [
        '00.0415', // Kleine Untersuchung durch Grundversorger bei Personen über 6 und unter 75 Jahren, pro 5 Min.
        '00.0425', // Umfassende Untersuchung durch Grundversorger, pro 5 Min.
        '00.0450', // Umfassende Untersuchung durch Grundversorger, 5 Min.
        '00.0460', // Umfassende Untersuchung durch Grundversorger, 5 Min.
        '00.1370', // Überwachung in Praxis, 15'
    ],
    diagnostik: [
        // 00.0415

        '00.0715', // Punktion, venös
        '17.0010', // EKG
        '15.0130', // Kleine Spirometrie
    ],
    roentgen: [
        '32.0010', // Röntgenuntersuchung Thorax
        '32.0020', // Röntgenuntersuchung Abdomen
        '32.0030', // Röntgenuntersuchung Extremitäten
        '32.0410', // Röntgenuntersuchung Wirbelsäule
        '39.0010', // Grundtaxe für bildgebende Verfahren
        '39.2000', // Technische Grundleistung Röntgen
    ],
    berichte: [

        '00.2285', // Nicht formalisierter Bericht
    ],
    wundversorgung: [
        '04.1010', // Wundversorg. spez. erste 3cm
        '04.1020', // Wundversorg. spez. weitere 3cm
        '04.1030', // Wundversorg. übrige, erste 6cm
        '04.1040', // Wundversorg. übrige, weitere 6cm
        '04.1050', // Débridement, erste 4cm2
        '04.1060', // +Débridement, weitere 4cm2

    ],
    sonstiges: [
        '00.0850', // Gefässzugang periphervenös
    ],
};
