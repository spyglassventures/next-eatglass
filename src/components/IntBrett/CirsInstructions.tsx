const CirsInstructions = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Anleitung zur CIRS-Erfassung</h2>
            <p className="mb-4">
                CIRS (Critical Incident Reporting System) dient der anonymen Erfassung und Analyse von kritischen Ereignissen im Praxisalltag, um daraus zu lernen und zukünftige Risiken zu minimieren.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">So funktioniert die Erfassung:</h3>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    Wählen Sie den Tab <strong>"Erfassen"</strong>, um ein neues Ereignis zu dokumentieren.
                </li>
                <li>
                    Füllen Sie die Felder möglichst vollständig aus. Relevante Felder sind mit Zusatzinformationen versehen.
                </li>
                <li>
                    Sie können sowohl positive als auch negative Aspekte des Falls beschreiben.
                </li>
                <li>
                    Die <strong>Take-home-Message</strong> hilft anderen Mitarbeitenden, aus dem Fall zu lernen.
                </li>
                <li>
                    Nach dem Absenden wird der Fall gespeichert und unter dem Tab <strong>"Historie"</strong> sichtbar.
                </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">Datenschutz und Anonymität</h3>
            <p className="mb-4">
                Bitte geben Sie keine personenbezogenen Daten von Patienten an. Die Einträge werden anonym gespeichert und sind nur innerhalb der Praxis einsehbar.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">Ziel des Systems</h3>
            <p>
                Das Ziel von CIRS ist nicht die Schuldzuweisung, sondern die kontinuierliche Verbesserung der Patientensicherheit und der internen Prozesse.
            </p>
        </div>
    );
};

export default CirsInstructions;
