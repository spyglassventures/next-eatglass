import { writeFile, utils } from 'xlsx';
import { DetailedDoctor } from '../../components/IntHIN/types';

function mapLanguageCode(code?: string): string {
    switch (code) {
        case 'DES': return 'Deutsch';
        case 'FRS': return 'Französisch';
        case 'ENG': return 'Englisch';
        case 'ITA': return 'Italienisch';
        default: return 'Keine bevorzugte Sprache bekannt';
    }
}

export function exportToExcel(doctors: DetailedDoctor[]) {
    const doctorData = doctors.map((doctor) => ({
        Name: doctor.academicTitle || doctor.firstName || doctor.lastName
            ? `${doctor.academicTitle || ''} ${doctor.firstName || ''} ${doctor.lastName || ''}`
            : doctor.displayName || doctor.integrationId || 'Kein Name verfügbar', // Fallback to displayName or integrationId
        Address: `${doctor.address || ''}, ${doctor.postalCode || ''} ${doctor.city || ''}`,
        Phone: doctor.phoneNr || '',
        Email: doctor.hinIds?.[0]?.email || '',
        Specialties: doctor.specialties ? doctor.specialties.join(', ') : 'Keine bekannt',
        SpecialistTitles: doctor.specialistTitles ? doctor.specialistTitles.map((title) => title.specialityText).join(', ') : 'Keine bekannt',
        Titel: doctor.academicTitle || 'Kein Titel bekannt',
        GLN: doctor.gln || 'Keine GLN bekannt',
        'Bevorzugte Sprache': mapLanguageCode(doctor.languageCode),
        Dachorganisation: doctor.parents ? doctor.parents.map((parent) => parent.name).join(', ') : 'Keine bekannt',
        'Zugehörige Teilnehmer': doctor.children ? doctor.children.map((child) => child.name).join(', ') : 'Keine bekannt',
    }));

    const worksheet = utils.json_to_sheet(doctorData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Doctors");

    writeFile(workbook, "DoctorsDetails.xlsx");
}

export function exportToCSV(doctors: DetailedDoctor[], filename = "DoctorsDetails") {
    const doctorData = doctors.map((doctor) => ({
        Name: doctor.academicTitle || doctor.firstName || doctor.lastName
            ? `${doctor.academicTitle || ''} ${doctor.firstName || ''} ${doctor.lastName || ''}`
            : doctor.displayName || doctor.integrationId || 'Kein Name verfügbar', // Fallback to displayName or integrationId
        Address: `${doctor.address || ''}, ${doctor.postalCode || ''} ${doctor.city || ''}`,
        Phone: doctor.phoneNr || '',
        Email: doctor.hinIds?.[0]?.email || '',
        Specialties: doctor.specialties ? doctor.specialties.join(', ') : 'Keine bekannt',
        SpecialistTitles: doctor.specialistTitles ? doctor.specialistTitles.map((title) => title.specialityText).join(', ') : 'Keine bekannt',
        Titel: doctor.academicTitle || 'Kein Titel bekannt',
        GLN: doctor.gln || 'Keine GLN bekannt',
        'Bevorzugte Sprache': mapLanguageCode(doctor.languageCode),
        Dachorganisation: doctor.parents ? doctor.parents.map((parent) => parent.name).join(', ') : 'Keine bekannt',
        'Zugehörige Teilnehmer': doctor.children ? doctor.children.map((child) => child.name).join(', ') : 'Keine bekannt',
    }));

    const worksheet = utils.json_to_sheet(doctorData);
    const csv = utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;  // Use provided filename or default
    link.click();
}
