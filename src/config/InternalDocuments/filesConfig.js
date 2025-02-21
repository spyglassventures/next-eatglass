// next-kappelihof/src/config/InternalDocuments/filesConfig.js

const documents = [
    {
        name: 'CIRS Vorlage Praxis',
        filename: 'CIRS_Vorlage_Praxis.pdf',
        path: '/api/documents/list_documents?filename=CIRS_Vorlage_Praxis.pdf',
        previewable: true,
        contentType: 'application/pdf',
    },
    {
        name: 'Praxis Muster Vorlage Arztpraxis CIRS Reporting',
        filename: 'Vorlage_Arztpraxis_CIRS_Reporting.docx',
        path: '/api/documents/list_documents?filename=Vorlage_Arztpraxis_CIRS_Reporting.docx',
        previewable: false,
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    {
        name: 'Muster Vorlage Arztpraxis CIRS Reporting',
        filename: 'Vorlage_Arztpraxis_CIRS_Reporting.pdf',
        path: '/api/documents/list_documents?filename=Vorlage_Arztpraxis_CIRS_Reporting.pdf',
        previewable: true,
        contentType: 'application/pdf',
    },
    {
        name: 'Personalstammblatt leere Vorlage (Änderung Kontoverbindung, Geburt Kind, Umzug, ...)',
        filename: 'Personalstammblatt_leere_Vorlage.docx',
        path: '/api/documents/list_documents?filename=Personalstammblatt_leere_Vorlage.docx',
        previewable: false,
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    {
        name: 'Personalstammblatt leere Vorlage (Änderung Kontoverbindung, Geburt Kind, Umzug, ...)',
        filename: 'Personalstammblatt_leere_Vorlage.pdf',
        path: '/api/documents/list_documents?filename=Personalstammblatt_leere_Vorlage.pdf',
        previewable: true,
        contentType: 'application/pdf',
    },
    {
        name: 'Bargeldquittung (Word)',
        filename: 'Quittung_Bargeld_Abholung_Template.docx',
        path: '/api/documents/list_documents?filename=Quittung_Bargeld_Abholung_Template.docx',
        previewable: false,
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    {
        name: 'Bargeldquittung',
        filename: 'Quittung_Bargeld_Abholung_Template.pdf',
        path: '/api/documents/list_documents?filename=Quittung_Bargeld_Abholung_Template.pdf',
        previewable: true,
        contentType: 'application/pdf',
    },
    {
        name: 'Inkontinenz Ablauf',
        filename: 'Inkontinenz_Ablauf.pdf',
        path: '/api/documents/list_documents?filename=Inkontinenz_Ablauf.pdf',
        previewable: true,
        contentType: 'application/pdf',
    },
    {
        name: 'Inkontinenz Bestellformular',
        filename: 'Inkontinenz_Bestellformular.pdf',
        path: '/api/documents/list_documents?filename=Inkontinenz_Bestellformular.pdf',
        previewable: true,
        contentType: 'application/pdf',
    },


    // Gesponsort
    {
        name: 'Drossa Bestellformular',
        filename: 'DROSSAPHARM-Bestellfax-d-4c-1224.pdf',
        path: '/api/documents/list_documents?filename=DROSSAPHARM-Bestellfax-d-4c-1224.pdf',
        previewable: true,
        contentType: 'application/pdf',
    },
    {
        name: 'Lixim Drossa Bestellformular',
        filename: 'Lixim Bestellfax_Landolt_06.23.pdf',
        path: '/api/documents/list_documents?filename=Lixim Bestellfax_Landolt_06.23.pdf',
        previewable: true,
        contentType: 'application/pdf',
    },
];

export default documents;
