import React from 'react';

export const TransactionDetails = ({ txDetails, txIndex }: { txDetails: any, txIndex: number }) => {
    const amount = `${txDetails?.Amt?.[0]?.['_']} ${txDetails?.Amt?.[0]?.['$']?.Ccy}`;
    const creditorRef = txDetails?.RmtInf?.[0]?.Strd?.[0]?.CdtrRefInf?.[0]?.Ref?.[0] || "N/A";
    const acctSvcrRef = txDetails?.Refs?.[0]?.AcctSvcrRef?.[0] || `Transaction ${txIndex + 1}`;
    const debtorName = txDetails?.RltdPties?.[0]?.Dbtr?.[0]?.Nm?.[0] || "N/A";

    return (
        <div className="bg-white p-4 mb-6 shadow-sm rounded-md border border-gray-200 relative">
            <div className="absolute top-0 right-0 mt-2 mr-2">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg shadow-lg transform hover:scale-110 transition-transform duration-200 ease-in-out">
                    {txIndex + 1}
                </span>
            </div>
            <p><strong>Transaktions ID:</strong> {acctSvcrRef}</p>
            <p><strong>Betrag:</strong> {amount}</p>
            <p><strong>Zahlungsreferenz:</strong> {creditorRef}</p>
            <p><strong>Debtor:</strong> {debtorName}</p>
        </div>
    );
};
