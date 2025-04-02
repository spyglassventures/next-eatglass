// components/TardocOverview.tsx
import React from 'react';

const TardocOverview = () => {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">TARMED Übersicht</h1>
            <p className="text-gray-700 mb-4">
                Mit diesem Programm können Sie eine TARMED-Rechnung erfassen – ganz ohne IT-Kenntnisse. Diese kann anschließend in einem Format exportiert werden, welches vom Konvertierungstool verstanden wird.
            </p>
            <p className="text-gray-700 mb-4">
                Das bedeutet: Die Datei, die hier erzeugt wird, muss heruntergeladen und im externen Tool hochgeladen werden.
                Der Einfachheit halber ist dies unter Punkt 3 bereits verlinkt.
            </p>
            <p className="text-gray-700">
                Die Auswertung kann danach wieder hier im Tool erfolgen – so sehen Sie direkt, ob der TARDOC c.p. für Sie eine positive oder negative Veränderung bringt.
            </p>
        </div>
    );
};

export default TardocOverview;
