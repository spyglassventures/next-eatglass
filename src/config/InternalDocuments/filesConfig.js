// next-kappelihof/src/config/InternalDocuments/filesConfig.js

const documents = [
    {
        name: 'CIRS Vorlage Praxis Kappelihof',
        filename: 'CIRS_Vorlage_Praxis_Kappelihof.pdf',
        path: '/api/documents/list_documents?filename=CIRS_Vorlage_Praxis_Kappelihof.pdf',
        previewable: true,
        contentType: 'application/pdf',
    },
    {
        name: 'Praxis Kappelihof Vorlage Arztpraxis CIRS Reporting',
        filename: 'Praxis_Kappelihof_Vorlage_Arztpraxis_CIRS_Reporting.docx',
        path: '/api/documents/list_documents?filename=Praxis_Kappelihof_Vorlage_Arztpraxis_CIRS_Reporting.docx',
        previewable: false,
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    {
        name: 'Praxis Kappelihof Vorlage Arztpraxis CIRS Reporting',
        filename: 'Praxis_Kappelihof_Vorlage_Arztpraxis_CIRS_Reporting.pdf',
        path: '/api/documents/list_documents?filename=Praxis_Kappelihof_Vorlage_Arztpraxis_CIRS_Reporting.pdf',
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
        name: 'Bargeldquittung',
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
];

export default documents;
