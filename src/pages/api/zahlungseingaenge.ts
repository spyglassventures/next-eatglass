'use server';

import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import { NextApiRequest, NextApiResponse } from 'next';

type TransactionDetails = {
    AcctSvcrRef: string;
    EndToEndId: string;
    Amt: string;
    Ccy: string;
    CdtDbtInd: string;
    RmtInf: string;
};

type ParsedData = {
    MsgId: string;
    CreDtTm: string;
    Ntry: TransactionDetails[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const directoryPath = path.join(process.cwd(), 'src/config/InternalDocuments/Zahlungseingaenge');
    const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.xml'));

    const parser = new xml2js.Parser();
    const loadedDocuments: ParsedData[] = [];

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const xmlData = fs.readFileSync(filePath, 'utf-8');
        const result = await parser.parseStringPromise(xmlData);

        const parsedData: ParsedData = {
            MsgId: result.Document.BkToCstmrDbtCdtNtfctn[0].GrpHdr[0].MsgId[0],
            CreDtTm: result.Document.BkToCstmrDbtCdtNtfctn[0].GrpHdr[0].CreDtTm[0],
            Ntry: result.Document.BkToCstmrDbtCdtNtfctn[0].Ntfctn[0].Ntry.map((entry: any) => ({
                AcctSvcrRef: entry.NtryDtls[0].TxDtls[0].Refs[0].AcctSvcrRef[0],
                EndToEndId: entry.NtryDtls[0].TxDtls[0].Refs[0].EndToEndId[0],
                Amt: entry.NtryDtls[0].TxDtls[0].Amt[0]._,
                Ccy: entry.NtryDtls[0].TxDtls[0].Amt[0].$.Ccy,
                CdtDbtInd: entry.NtryDtls[0].TxDtls[0].CdtDbtInd[0],
                RmtInf: entry.NtryDtls[0].TxDtls[0].RmtInf[0].Strd[0].CdtrRefInf[0].Ref[0],
            })),
        };

        loadedDocuments.push(parsedData);
    }

    res.status(200).json(loadedDocuments);
}
