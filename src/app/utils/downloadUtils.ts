// File: utils/downloadUtils.ts

/**
 * Triggers a browser download for a given Blob object.
 *
 * @param blob The Blob object to download. Can be null.
 * @param filename The desired filename for the download.
 */
export const downloadBlob = (blob: Blob | null, filename: string): void => {
    if (!blob) {
        console.warn("Download cancelled: Blob is null or undefined.");
        alert("Keine Datei zum Herunterladen vorhanden."); // Or handle silently
        return;
    }

    try {
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename; // Use the provided filename

        // Append the anchor to the body, click it, and remove it
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revoke the object URL to free up memory after a short delay
        setTimeout(() => URL.revokeObjectURL(url), 100);

    } catch (error) {
        console.error(`Fehler beim Herunterladen der Datei "${filename}":`, error);
        alert(`Fehler beim Erstellen des Downloads für "${filename}".`);
    }
};

// You could add other download-related utilities here in the future.