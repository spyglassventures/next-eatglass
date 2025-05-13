// components/Recall/DropzoneRecallUpload.tsx
import React, { useRef, useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";

type Props = {
    onParsed: (rows: any[]) => void;
};

const MAX_TOTAL_MB = 5;
const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;

const DropzoneRecallUpload: React.FC<Props> = ({ onParsed }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileNames, setFileNames] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropAreaRef = useRef<HTMLDivElement>(null);

    const parseExcel = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet);
            onParsed(json);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleFileUpload = (files: File[] | null) => {
        if (!files) return;
        const excel = files.filter((f) => f.name.endsWith(".xlsx") || f.name.endsWith(".xls"));
        const totalSize = excel.reduce((acc, f) => acc + f.size, 0);
        if (totalSize > MAX_TOTAL_BYTES) {
            alert(`❌ Die Dateien überschreiten ${MAX_TOTAL_MB} MB.`);
            return;
        }
        setFileNames(excel.map((f) => f.name));
        if (excel[0]) parseExcel(excel[0]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFileUpload(Array.from(e.target.files));
        }
    };

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer?.files) {
            handleFileUpload(Array.from(e.dataTransfer.files));
        }
    }, []);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    useEffect(() => {
        const dropArea = dropAreaRef.current;
        if (dropArea) {
            dropArea.addEventListener("dragover", handleDragOver);
            dropArea.addEventListener("drop", handleDrop);
            dropArea.addEventListener("dragleave", handleDragLeave);
            return () => {
                dropArea.removeEventListener("dragover", handleDragOver);
                dropArea.removeEventListener("drop", handleDrop);
                dropArea.removeEventListener("dragleave", handleDragLeave);
            };
        }
    }, [handleDrop, handleDragOver, handleDragLeave]);

    return (
        <div
            ref={dropAreaRef}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-md text-center cursor-pointer transition-all duration-200 mb-6 ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300 hover:border-gray-400"
                } p-6`}
        >
            {fileNames.length > 0
                ? <span>{fileNames.join(", ")}</span>
                : <span>Excel-Dateien hierhin ziehen oder klicken</span>}
            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                multiple
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};

export default DropzoneRecallUpload;