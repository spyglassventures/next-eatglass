
// src/app/pdf/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Home = () => {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [showLogs, setShowLogs] = useState(true);
  const [ids, setIds] = useState({ vectorStoreId: '', fileId: '' });

  const totalSteps = 5;

  const highlightKeyword = (message) => {
    return message
      .replace(/URL/g, '<span class="bg-yellow-300">URL</span>')
      .replace(/Vector store/g, '<span class="bg-blue-300">Vector store</span>')
      .replace(/File ID/g, '<span class="bg-green-300">File ID</span>')
      .replace(/Error/g, '<span class="bg-red-300">Error</span>')
      .replace(/Summary/g, '<span class="bg-purple-300">Summary</span>');
  };

  const addLog = useCallback((message, type = 'info', delay = 0) => {
    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString();
      const formattedMessage = `<span class="${type === 'error' ? 'text-red-500' : 'text-green-500'}">${timestamp}:</span> ${highlightKeyword(message)} ${type === 'error' ? '⚠️' : '📄'}`;
      setLogs((prevLogs) => [...prevLogs, formattedMessage]);
      setStep((prevStep) => {
        const newStep = prevStep + 1;
        setProgress((newStep / totalSteps) * 100);
        return newStep;
      });
    }, delay);
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      const logContainer = document.getElementById('log-container');
      if (logContainer) {
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    };

    scrollToBottom();
  }, [logs]);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleShowLogsChange = (e) => {
    setShowLogs(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSummary('');
    setLogs([]);
    setProgress(0);
    setStep(0);
    setIds({ vectorStoreId: '', fileId: '' });

    addLog('Sending request to API for file upload and vector store creation...', 'info', 0);

    try {
      addLog(`Processing URL: ${url}`, 'info', 500);
      const response = await axios.post('/api/upload', { url });

      if (response.data.vectorStoreId && response.data.fileId) {
        addLog(`Vector store created with ID: ${response.data.vectorStoreId}`, 'info', 1000);
        addLog(`File ID: ${response.data.fileId}`, 'info', 1500);
        setIds({ vectorStoreId: response.data.vectorStoreId, fileId: response.data.fileId });

        if (response.data.logs && response.data.logs.length > 0) {
          response.data.logs.forEach((log, index) => addLog(log, 'info', 2000 + index * 500));
        }

        addLog('Sending request to API for summarization...', 'info', 3000);
        const summaryResponse = await axios.post('/api/summarize', {
          vectorStoreId: response.data.vectorStoreId,
          fileId: response.data.fileId,
        });

        if (summaryResponse.data.summary) {
          setSummary(summaryResponse.data.summary);
          addLog('Summary received successfully.', 'info', 3500);
        } else {
          addLog(summaryResponse.data.log || 'No summary received.', 'info', 3500);
        }
      }
    } catch (error) {
      console.error('Error processing URL', error);
      addLog(`Error processing URL: ${error.message}`, 'error', 4000);
    } finally {
      setIsLoading(false);
      addLog('Zusammenfassung wurde erstellt.', 'info', 4500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Zusammenfassung von Online PDF. Bitte URL eingeben.</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            className="w-full p-3 border rounded mb-4 text-black"
            placeholder="Bitte PDF URL eingeben"
            value={url}
            onChange={handleUrlChange}
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="show-logs"
              className="mr-2"
              checked={showLogs}
              onChange={handleShowLogsChange}
            />
            <label htmlFor="show-logs" className="text-black">Show logs</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isLoading || !url.trim()}
          >
            {isLoading ? 'Zusammenfassung in Bearbeitung...' : 'Submit'}
          </button>
        </form>

        {isLoading && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-black">Progress:</h2>
            <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
              <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-black">{step} out of {totalSteps} steps completed</p>
          </div>
        )}

        {showLogs && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-black">Logs:</h2>
            <div id="log-container" className="bg-gray-900 text-white p-4 rounded text-xs font-mono h-40 overflow-y-auto">
              {logs.map((log, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: log }} />
              ))}
            </div>
          </div>
        )}

        {summary && (
          <div className="mt-6 bg-gray-200 p-8 h-64 overflow-auto rounded">
            <h2 className="text-xl font-semibold mb-2 text-black">Zusammenfassung:</h2>
            <p className="text-black">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
