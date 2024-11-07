export type Doctor = {
    integrationId: string;
    displayName: string;
    city?: string;
    postalCode?: string;
    address?: string;
    phoneNr?: string;
    hinIds?: Array<{ email: string }>;
    contactType: number;
    specialistTitles: string;
    specialties: string[];
    zipCode: string;


};

export type DetailedDoctor = {
    integrationId: string;  // Added integrationId
    firstName?: string;
    lastName?: string;
    academicTitle?: string;
    displayName?: string;
    languageCode?: string;
    specialistTitles?: Array<{ specialityText: string; translations: Array<{ languageCode: string; translationText: string }> }>;
    address?: string;
    postalCode?: string;
    phoneNr?: string;
    city?: string;
    hinIds?: Array<{ email: string }>;
    parents?: Array<any>;
    children?: Array<any>;
    specialties: string[];
    gln?: string;
    searchInProgress: boolean;
};
