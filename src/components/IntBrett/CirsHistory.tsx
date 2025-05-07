import React, { useEffect, useState } from 'react';
import cirsConfig from "../../config/cirsConfig.json";

export interface CIRSEntry {
  id: number;
  fallnummer: string;
  praxis_id: number;
  fachgebiet: string;
  ereignis_ort: string;
  ereignis_tag: string;
  versorgungsart: string;
  asa_klassifizierung: string;
  patientenzustand: string;
  begleitumstaende: string;
  medizinprodukt_beteiligt: string;
  fallbeschreibung: string;
  positiv: string;
  negativ: string;
  take_home_message: string;
  haeufigkeit: string;
  berichtet_von: string;
  berufserfahrung: string;
  bemerkungen: string;
  created_at: Date;
  // ToDo: this could be used in api/pg_getCirs.ts
}

interface CirsTableProps {
  cirsHistory: CIRSEntry[];
  loadMore: () => void;
  refreshHistory: () => void;
  loading: boolean;
  error: string;
}

/**
 * ExpandableJsonCell and ExpandableCell components remain unchanged.
 */

const ExpandableJsonCell: React.FC<{
  jsonText: string;
  defaultExpanded?: boolean;
}> = ({ jsonText, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  let parsed: any;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    return <div style={{ whiteSpace: "pre-wrap" }}>{jsonText}</div>;
  }
  const messages = parsed.messages;
  if (!messages || !Array.isArray(messages)) {
    return <div style={{ whiteSpace: "pre-wrap" }}>{jsonText}</div>;
  }

  const displayMessages = expanded ? messages : messages.slice(0, 2);

  return (
    <div className="text-xs">
      {displayMessages.map((msg: any, index: number) => (
        <div key={index}>
          <strong>{msg.role}:</strong>{" "}
          {msg.role === "user" ? (
            <span style={{ backgroundColor: "yellow", padding: "0 2px" }}>
              {msg.content}
            </span>
          ) : (
            msg.content
          )}
        </div>
      ))}
      {messages.length > displayMessages.length &&
        !defaultExpanded &&
        !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-500 underline"
          >
            Read More
          </button>
        )}
      {!defaultExpanded && expanded && messages.length > 2 && (
        <button
          onClick={() => setExpanded(false)}
          className="ml-2 text-blue-500 underline"
        >
          Show Less
        </button>
      )}
    </div>
  );
};

const ExpandableCell: React.FC<{
  text: string;
  limit?: number;
  alwaysExpanded?: boolean;
}> = ({ text, limit = 50, alwaysExpanded = false }) => {
  // Attempt to parse the text as JSON.
  // This is done unconditionally.
  const parsed = (() => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  })();
  const hasMessages =
    parsed && parsed.messages && Array.isArray(parsed.messages);

  // Always call the hook
  const [expanded, setExpanded] = useState(false);

  // If the text contains a valid messages array, delegate to ExpandableJsonCell.
  if (hasMessages) {
    return (
      <ExpandableJsonCell jsonText={text} defaultExpanded={alwaysExpanded} />
    );
  }

  // If alwaysExpanded, render the full text.
  if (alwaysExpanded) {
    return (
      <div className="text-xs">
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{text}</pre>
      </div>
    );
  }

  // Otherwise, use the expandable/collapsible logic.
  const toggle = () => setExpanded(!expanded);
  const safeText = text || "";
  const displayText =
    !expanded && safeText.length > limit
      ? safeText.substring(0, limit)
      : safeText;

  return (
    <div className="text-xs">
      <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{displayText}</pre>
      {!expanded && safeText.length > limit && "..."}
      {safeText.length > limit && (
        <button onClick={toggle} className="ml-1 text-blue-500 underline">
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

const CirsTable: React.FC<CirsTableProps> = ({
  cirsHistory,
  loadMore,
  refreshHistory,
  loading,
  error,
}) => {
  // Always call hooks unconditionally.
  const [selectedEntry, setSelectedEntry] = useState<CIRSEntry | null>(null);

  const closeModal = () => {
    setSelectedEntry(null);
  };

  return (
    <>
      <div className="px-4">
        <div className="overflow-x-auto">
          <table
            className="table-auto divide-y divide-gray-200 border text-xs"
            style={{ minWidth: "1600px" }}
          >
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Fallnummer</th>
                <th className="border px-4 py-2">Fachgebiet</th>
                <th className="border px-4 py-2">Fallbeschreibung</th>
                <th className="border px-4 py-2">Berichtet von</th>
                <th className="border px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {cirsHistory.map((entry) => (
                <tr key={entry.id}>
                  <td className="flex items-center space-x-1 border px-4 py-2">
                    <span>{entry.id}</span>
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      title="View Details"
                      className="focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </td>
                  <td className="border px-4 py-2">{entry.fallnummer}</td>
                  <td className="border px-4 py-2">{entry.fachgebiet}</td>
                  <td className="whitespace-pre-wrap border px-4 py-2">
                    <ExpandableCell text={entry.fallbeschreibung} limit={50} />
                  </td>
                  <td className="border px-4 py-2">{entry.berichtet_von}</td>
                  <td className="border px-4 py-2">
                    {entry.created_at
                      ? entry.created_at.toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            onClick={loadMore}
            className="rounded bg-blue-500 px-4 py-2 text-xs text-white hover:bg-blue-600"
          >
            Mehr Einträge laden
          </button>
        </div>
      </div>

      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          <div
            className="flex flex-col rounded bg-white shadow-lg"
            style={{ width: "85vw", height: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-bold">
                Log Details (ID: {selectedEntry.id})
              </h2>
              <button
                onClick={closeModal}
                className="text-2xl leading-none text-gray-500 hover:text-gray-700"
                title="Close"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="mb-4">
                <strong>Fallnummer:</strong> {selectedEntry.fallnummer}
              </div>
              {/*<div className="mb-4">*/}
              {/*  <strong>Timestamp:</strong>{" "}*/}
              {/*  {selectedEntry.timestamp*/}
              {/*    ? new Date(selectedEntry.timestamp).toLocaleString()*/}
              {/*    : "N/A"}*/}
              {/*</div>*/}
              {/*<div className="mb-4">*/}
              {/*  <strong>Request:</strong>*/}
              {/*  <div*/}
              {/*    className="mt-1 overflow-auto bg-gray-100 p-2"*/}
              {/*    style={{ maxHeight: "40vh" }}*/}
              {/*  >*/}
              {/*    <ExpandableCell*/}
              {/*      text={selectedEntry.request}*/}
              {/*      alwaysExpanded={true}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}
              {/*<div>*/}
              {/*  <strong>Response:</strong>*/}
              {/*  <div*/}
              {/*    className="mt-1 overflow-auto bg-gray-100 p-2"*/}
              {/*    style={{ maxHeight: "40vh" }}*/}
              {/*  >*/}
              {/*    <ExpandableCell*/}
              {/*      text={selectedEntry.response}*/}
              {/*      alwaysExpanded={true}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
      )}
    </>
  );
};


const CirsHistory: React.FC = () => {
    const [cirsHistory, setCirsHistory] = useState<CIRSEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [offset, setOffset] = useState(0);
    const limit = 20; // Load 20 rows at a time

    // Initial load on component mount.
    useEffect(() => {
        const initialFetch = async () => {
            const CirsHistory = await fetchCirsHistory(0);
            setCirsHistory(CirsHistory);
            setLoading(false);
        };
        initialFetch();
    }, []);

    const fetchCirsHistory = async (offsetParam = 0): Promise<CIRSEntry[]> => {
        try {
            // Build the URL with query parameters based on the filter state.
            let url = `/api/cirs/v1/pg_getCirs?limit=${limit}&offset=${offsetParam}&praxisId=${cirsConfig.praxisId}`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Error fetching logs');
            }
            const data = await res.json();
            return data.cirsEntries as CIRSEntry[];
        } catch (err: any) {
            setError(err.message);
            return [];
        }
    };

    const loadMore = async () => {
        const newOffset = offset + limit;
        const moreCirsHistory = await fetchCirsHistory(newOffset);
        setCirsHistory((prev) => [...prev, ...moreCirsHistory]);
        setOffset(newOffset);
    };

    const refreshHistory = async () => {
        setLoading(true);
        setOffset(0);
        const refreshedHistory = await fetchCirsHistory(0);
        setCirsHistory(refreshedHistory);
        setLoading(false);
    };

    return (
        // Full-width container with no horizontal padding or max-width restrictions.
        <div className="w-full" style={{ margin: 0, padding: 0 }}>
            <div className="flex items-center justify-between mb-4 px-4">
                <h1 className="text-2xl font-bold">CIRS Historie</h1>
                <button
                    onClick={refreshHistory}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-xs"
                >
                    Aktualisieren
                </button>
            </div>

            {loading && <p className="text-xs px-4">Loading history...</p>}
            {error && <p className="text-red-500 text-xs px-4">Error: {error}</p>}
            {!loading && cirsHistory.length === 0 && <p className="px-4 text-xs">No history found.</p>}
            {!loading && cirsHistory.length > 0 && (
                <CirsTable
                    cirsHistory={cirsHistory}
                    loadMore={() => loadMore()}
                    refreshHistory={refreshHistory}
                    loading={loading}
                    error={error}
                />
            )}
        </div>
    );
}

export default CirsHistory;