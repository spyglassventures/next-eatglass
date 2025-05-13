export interface RecallEntry {
  id: number;
  praxis_id: number;

  patientenname: string;
  geburtsdatum: string; // oder Date, je nachdem
  kontaktart: "Telefon" | "E-Mail" | "Brief" | "SMS" | string;
  kontaktinfo: string;

  erinnerungsanlass: string; // z. B. "Diabetes Jahreskontrolle"
  recallsystem: "E-Mail" | "Telefon" | "automatisch" | string;

  recall_datum: string; // ISO-Date
  rueckmeldung_erhalten: boolean;

  naechster_termin: string;
  zusätzliche_laborwerte: string;
  zusätzliche_diagnostik: string;
  naechster_recall_in_tagen: number;
  bemerkungen: string;

  created_at: Date;
}
