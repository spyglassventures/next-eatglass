export interface CIRSEntry {
  id: number;
  fallnummer: string;
  praxis_id: number;
  fachgebiet: string;
  ereignis_ort: string;
  ereignis_tag: string;
  versorgungsart: string;
  asa_klassifizierung: string;
  patientenzustand: string;
  begleitumstaende: string;
  medizinprodukt_beteiligt: string;
  fallbeschreibung: string;
  positiv: string;
  negativ: string;
  take_home_message: string;
  haeufigkeit: string;
  berichtet_von: string;
  berufserfahrung: string;
  bemerkungen: string;
  created_at: Date;
  // is_deleted: boolean;
}
