import React from 'react';

const GitHelper = () => {
    const imageDescriptions = [
        {
            imgSrc: '/images/git/git1.png',
            text: 'Aufzählungen gehören in mehrere Zeilen. Sie starten mit " und enden mit ". Die letzte Zeile einer Aufzählung ohne ,',
        },
        {
            imgSrc: '/images/git/git2.png',
            text: 'Auflistungen haben am Ende eine Komma. Der letzte Eintrag einer Aufzählungen hat kein Komma am Ende. Hier fehlt das Komma nach dem ersten Eintrag und ist falschlicherweise bei der letzten Zeile.',
        },
        {
            imgSrc: '/images/git/git3.png',
            text: 'Der erste Eintrag der Aufzählung hat nun ein Komma (richtig). DIe letzte Zeile muss aber ohne Komma sein.',
        },
        {
            imgSrc: '/images/git/git5.png',
            text: 'RICHTIGES Beispiel einer Aufzählung.',
        },
        {
            imgSrc: '/images/git/git4.png',
            text: 'Die } Klammer fehlt nach der Zeile mit ],  Möchte ich einen neuen Eintrag machen (z.B. in DocNumbers.ts, so ist dies am einfachsten, wenn man einen vollständigen Block kopiert (inkl. Öffnungs- und Schließklammer) und diesen anpasst.',
        },
    ];

    const userMistakeExamples = [
        {
            title: 'Häufige Fehler beim Bearbeiten der Datei "newsLatterBoxConfig.json"',
            text: `Fehler 1: Fehlendes Komma zwischen Einträgen:
{
  "title": "Praxisinformationen",
  "address": {
    "title": "Adresse",
    "content": [
      "Hausarztpraxis Muster AG",
      "Blaustrasse 1",
      "9000 Musterort, SG" // <== Fehlendes Komma am Ende der Zeile
      "E-Mail: praxis_abc@hin.ch",  
      "Telefon: +41 81 756 20 00"
    ]
  }
}

Fehler 2: Fehlende Anführungszeichen oder Klammern:
{
  "title": Praxisinformationen,  // <== Fehlende Anführungszeichen um "Praxisinformationen". Hier handelt es sich un eine Überschrift, die in Anführungszeichen stehen muss. 
  "address": {
    "title": "Adresse",
    "content": [
      "Hausarztpraxis Muster AG",
      "Blaustrasse 1",
      "9000 Musterort, SG"
    ]
  // <== Fehlende geschlossene geschweifte Klammer
}`
        },
        {
            title: 'Häufige Fehler beim Bearbeiten der Datei "lageplanConfig.json"',
            text: `Fehler 1: Fehlendes Komma in der Liste von Abschnitten:
{
  "sections": [
    {
      "title": "Anreise mit dem Auto",
      "content": "Aus Zürich kommend via A3 Richtung Chur."
    } // <== Fehlendes Komma nach dem vorherigen Abschnitt. Es muss heissen },
    {  
      "title": "Anreise mit den ÖV",
      "content": "Wir sind nur wenige Gehminuten vom Bahnhof Musterort entfernt."
    }
  ]
}

Fehler 2: Falsch formatierte URL:
{
  "map": {
    "src": https://www.google.com/maps/embed?pb=!1m18!1m12!,  // <== Fehlende Anführungszeichen um die URL
    "width": 600,
    "height": 450
  }
}`
        },

        {
            title: 'Häufige Fehler beim Bearbeiten der Datei "aboutSectionOneConfig.json"',
            text: `Fehler 1: Fehlende Anführungszeichen um Schlüssel oder Werte:
{
  title: "Was Sie von uns erwarten können",  // <== Fehlende Anführungszeichen um "title"
  "paragraph": "Wir bieten Ihnen eine umfassende Gesundheitsversorgung an."
}

Fehler 2: Fehlendes Komma in der Liste:
{
  "listItems": [
    "Eigene Praxisapotheke"
    "Unfallversorgung",  // <== Fehlendes Komma zwischen den Listeneinträgen
    "Infusionsbehandlungen"
  ]
}`
        }
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Datein editieren im Github: Gängige Fehler, Tips und Tricks</h2>
            <div className="grid grid-cols-1 gap-4">
                {imageDescriptions.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <img src={item.imgSrc} alt={`git-help-${index}`} className="mb-2 w-full" />
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                {userMistakeExamples.map((example, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50 mb-4">
                        <h3 className="text-lg font-bold mb-2">{example.title}</h3>
                        <pre className="whitespace-pre-wrap text-sm leading-tight">{example.text}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GitHelper;
