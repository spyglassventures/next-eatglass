'use client';

import React, { useEffect, useState } from 'react';
import xml2js from 'xml2js';
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { SearchResults } from './SearchResults';
import { TransactionDetails } from './TransactionDetails';

const Zahlungseingaenge: React.FC = () => {
    const [files, setFiles] = useState<string[]>([]);
    const [transactionCounts, setTransactionCounts] = useState<Record<string, number>>({});
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Record<string, any[]>>({});
    const [fileContent, setFileContent] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);


    useEffect(() => {
        const fetchFiles = async () => {
            const response = await fetch('/api/listFiles');
            const data = await response.json();
            setFiles(data.files);
        };

        fetchFiles();
    }, []);

    useEffect(() => {
        const fetchTransactionCounts = async () => {
            const counts: Record<string, number> = {};

            for (const fileName of files) {
                const response = await fetch(`/api/readFile?fileName=${encodeURIComponent(fileName)}`);
                const data = await response.json();

                const parser = new xml2js.Parser();
                parser.parseString(data.content, (err, result) => {
                    if (err) {
                        console.error(`Failed to parse XML for ${fileName}`, err);
                    } else {
                        const entries = result?.Document?.BkToCstmrDbtCdtNtfctn?.[0]?.Ntfctn?.[0]?.Ntry || [];
                        let transactionCount = 0;

                        entries.forEach((entry: any) => {
                            transactionCount += entry?.NtryDtls?.[0]?.TxDtls?.length || 0;
                        });

                        counts[fileName] = transactionCount;
                    }
                });
            }

            setTransactionCounts(counts);
        };

        if (files.length > 0) {
            fetchTransactionCounts();
        }
    }, [files]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            performSearch(searchQuery);
        } else {
            setSearchResults({});
        }
    }, [searchQuery]);

    const performSearch = async (query: string) => {
        const results: Record<string, any[]> = {};

        for (const fileName of files) {
            const response = await fetch(`/api/readFile?fileName=${encodeURIComponent(fileName)}`);
            const data = await response.json();

            const parser = new xml2js.Parser();
            parser.parseString(data.content, (err, result) => {
                if (err) {
                    console.error(`Failed to parse XML for ${fileName}`, err);
                } else {
                    const entries = result?.Document?.BkToCstmrDbtCdtNtfctn?.[0]?.Ntfctn?.[0]?.Ntry || [];

                    entries.forEach((entry: any) => {
                        entry?.NtryDtls?.[0]?.TxDtls?.forEach((txDetails: any) => {
                            const amount = `${txDetails?.Amt?.[0]?.['_']} ${txDetails?.Amt?.[0]?.['$']?.Ccy}`;
                            const creditorRef = txDetails?.RmtInf?.[0]?.Strd?.[0]?.CdtrRefInf?.[0]?.Ref?.[0] || "";
                            const acctSvcrRef = txDetails?.Refs?.[0]?.AcctSvcrRef?.[0] || "";
                            const debtorName = txDetails?.RltdPties?.[0]?.Dbtr?.[0]?.Nm?.[0] || "";
                            const transactionString = `${amount} ${creditorRef} ${acctSvcrRef} ${debtorName}`.toLowerCase();

                            if (transactionString.includes(query.toLowerCase())) {
                                if (!results[fileName]) {
                                    results[fileName] = [];
                                }
                                results[fileName].push({
                                    amount,
                                    creditorRef,
                                    acctSvcrRef,
                                    debtorName,
                                });
                            }
                        });
                    });
                }
            });
        }

        setSearchResults(results);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setSelectedFile(null); // Clear the selected file when a new search is made
    };

    const handleFileClick = async (fileName: string) => {
        setSelectedFile(fileName);
        setSearchQuery(''); // Clear search when a file is clicked

        const response = await fetch(`/api/readFile?fileName=${encodeURIComponent(fileName)}`);
        const data = await response.json();

        const parser = new xml2js.Parser();
        parser.parseString(data.content, (err, result) => {
            if (err) {
                console.error("Failed to parse XML", err);
            } else {
                setFileContent(result);
            }
        });
    };

    const handleDownloadClick = (fileName: string) => {
        const link = document.createElement('a');
        link.href = `/api/zahlungseingaenge_api?fileName=${encodeURIComponent(fileName)}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Zahlungseingänge XML Files</h1>
                <div className="relative w-1/3">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border rounded-md p-3 w-full"
                        placeholder="Zahlungen durchsuchen..."
                    />
                    <MagnifyingGlassIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
            </div>
            <div className="flex space-x-6">
                <div className="w-1/3">
                    <ul className="space-y-4 mb-8">
                        {files.map((file, index) => (
                            <li
                                key={index}
                                onClick={() => handleFileClick(file)}
                                className={`transition-colors p-4 rounded-lg shadow-sm flex justify-between items-center cursor-pointer ${selectedFile === file ? 'bg-gray-300' : searchResults[file] ? 'bg-blue-100' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                <span>{file}</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-600 text-sm">
                                        {transactionCounts[file] ? `${transactionCounts[file]} Einzelbuchungen` : 'Loading...'}
                                    </span>
                                    <ArrowDownTrayIcon
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering the file click
                                            handleDownloadClick(file);
                                        }}
                                        className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-800"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-2/3">
                    {searchQuery.length > 0 ? (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Zahlungen durchsuchen</h2>
                            <SearchResults searchResults={searchResults} searchQuery={searchQuery} />
                        </div>
                    ) : (
                        selectedFile && fileContent && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">
                                    Details der Datei {selectedFile}
                                </h2>
                                {fileContent?.Document?.BkToCstmrDbtCdtNtfctn?.[0]?.Ntfctn?.[0]?.Ntry?.map((entry: any, entryIndex: number) => (
                                    entry?.NtryDtls?.[0]?.TxDtls?.map((txDetails: any, txIndex: number) => (
                                        <TransactionDetails key={txIndex} txDetails={txDetails} txIndex={txIndex} />
                                    ))
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Zahlungseingaenge;
