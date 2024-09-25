import SectionTitle from "../Common/SectionTitle";

const Agb = ({ medicalServiceName, locationAddress, validFromDate, platformUrl }) => {
  const sections = [
    // 1
    {
      baseTitle: "Gültigkeit Vertragsbedingungen",
      content: [
        {
          title: "Allgemeines",
          text: "Diese Vertragsbedingungen sind ab dem Datum der ersten Inanspruchnahme gültig und umfassen alle Interaktionen am Standort sowie online.",
        },
      ],
    },
    // 2
    {
      baseTitle: `Für über die Plattform ${platformUrl} abgeschlossene Verträge geltende Bestimmungen`,
      content: [
        {
          title: `Leistungen von ${medicalServiceName} über die Plattform`,
          text: "Die Leistungen umfassen medizinische Diagnosen und Konsultationen, die über die Plattform mit vorheriger Terminvereinbarung angeboten werden.",
        },
        {
          title: "Anfragen in Bereichen, in denen keine Leistungen erbracht werden können",
          text: "Bestimmte medizinische Anfragen können aufgrund ihrer Natur nicht über die Plattform bearbeitet werden und erfordern persönlichen Kontakt.",
        },
        {
          title: `Kommunikation zwischen ${medicalServiceName} und Patienten und Sicherheit`,
          text: "Alle Kommunikationen über die Plattform sind verschlüsselt, um die Sicherheit und Vertraulichkeit der Patientendaten zu gewährleisten.",
        },
        {
          title: "Cookies und Google Analytics",
          text: "Die Plattform verwendet Cookies und Google Analytics zur Verbesserung der Benutzererfahrung und zur Analyse der Nutzung.",
        },
        {
          title: "Betroffenen-Recht",
          text: "Patienten haben das Recht, ihre gespeicherten Daten einzusehen, zu ändern oder zu löschen.",
        },
      ],
    },
    // 3
    {
      baseTitle: "Besondere Bestimmungen für Terminbuchungen über die Webseite",
      content: [
        {
          title: "Angaben zum Patienten und Vertragsabschluss",
          text: "Die Registrierung und Buchung von Terminen über die Webseite erfordert die Angabe persönlicher und medizinischer Informationen.",
        },
        {
          title: `Kommunikation mit ${medicalServiceName}`,
          text: "Die Kommunikation findet über sichere Kanäle statt, wobei alle gesendeten Daten entsprechend geschützt werden.",
        },
      ],
    },
    // 4
    {
      baseTitle: "Für alle Verträge geltende Bestimmungen",
      content: [
        {
          title: "Preis und Bezahlung",
          text: "Die Bezahlung für Leistungen erfolgt gemäß den aktuellen Tarifen, die auf der Plattform und in der Praxis einsehbar sind.",
        },
        {
          title: "Patientendaten und Datenschutz",
          text: "Alle Patientendaten werden streng vertraulich behandelt und nur für die Erbringung medizinischer Dienstleistungen verwendet.",
        },
        {
          title: "Ablehnung Patientenbehandlung und Beendigung des Vertrags",
          text: `${medicalServiceName} ist berechtigt, die Behandlung zu verweigern, wenn die Kriterien nicht erfüllt sind. Der Vertrag kann jederzeit beendet werden.`,
        },
        {
          title: "Sorgfaltspflicht und Haftung",
          text: "Die erbrachten Leistungen folgen den höchsten medizinischen Standards und gesetzlichen Anforderungen.",
        },
        {
          title: "Schlussbestimmungen",
          text: "Änderungen dieser Bedingungen bedürfen der schriftlichen Form und sind nur wirksam, wenn sie von beiden Parteien unterzeichnet werden.",
        },
      ],
    },
  ];

  return (
    <section id="about" className="pt-1 md:pt-1 lg:pt-1">
      <div className="container mx-auto px-4">
        <div className="p-0 ">
          <SectionTitle
            title={`Vertragsbedingungen ${medicalServiceName}`}
            paragraph={`Gültig ab ${validFromDate} für die Erbringung von ärztlichen und psychotherapeutischen Leistungen in der Praxis am Standort ${locationAddress}.`}
            mb="mb-8 "
          />

          {sections.map((section, index) => (
            <div key={index} className="mb-6 pt-5">
              {/* <h3 className="font-semibold text-xl mb-2 pb-2">{section.baseTitle}</h3> */}
              <h3 className="font-semibold text-xl mb-2 pb-2">{`${index + 1}. ${section.baseTitle}`}</h3>
              <div className="pl-1">
                {section.content.map((subsection, subIndex) => (
                  <div key={subIndex} className="mb-4">
                    <h4 className="font-semibold text-lg mt-4 mb-1">
                      {`${index + 1}.${subIndex + 1} ${subsection.title}`}
                    </h4>
                    <p>{subsection.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agb;