// src/components/Common/exportToXlsx.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ColumnHeader {
  key: string;
  label: string;
}

/**
 * Converts JSON data to an XLSX file and triggers download.
 * @param jsonData Array of objects, where each object is a row.
 * @param fileName The desired name for the XLSX file (e.g., "my_data.xlsx").
 * @param headers Optional array of { key, label } for custom column order and headers.
 */
export function exportToXlsx(
  jsonData: any[],
  fileName: string,
  headers?: ColumnHeader[]
): void {
  if (!jsonData || jsonData.length === 0) {
    console.warn("No data to export.");
    return;
  }

  // 1. Prepare the data for the worksheet
  let dataForSheet: any[] = [];
  let headerRow: string[] = [];

  if (headers && headers.length > 0) {
    // If custom headers are provided, use them for order and labels
    headerRow = headers.map(h => h.label);
    dataForSheet.push(headerRow); // Add custom header row

    jsonData.forEach(row => {
      const newRow: any[] = [];
      headers.forEach(header => {
        newRow.push(row[header.key]); // Push value based on key order
      });
      dataForSheet.push(newRow);
    });
  } else {
    // If no custom headers, assume first row's keys are headers and get data directly
    headerRow = Object.keys(jsonData[0]);
    dataForSheet.push(headerRow); // Add default header row (keys from first object)

    jsonData.forEach(row => {
      const newRow: any[] = [];
      headerRow.forEach(key => {
        newRow.push(row[key]);
      });
      dataForSheet.push(newRow);
    });
  }

  // 2. Create a new workbook and a worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(dataForSheet); // aoa_to_sheet is for array of arrays

  // 3. Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // 'Sheet1' is the worksheet name

  // 4. Write the workbook to a buffer
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // 5. Create a Blob and trigger download
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });
  saveAs(data, fileName);
}
