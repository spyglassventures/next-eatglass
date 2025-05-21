import { z } from "zod";
import { parse, format } from "date-fns";

export const TableName = "recall_entries";

const toDate = (val: string) => {
  return val ? new Date(val) : null;
};

const jaNeinToBoolean = (val: string): boolean => {
  const JaNeinValues = {
    Ja: true,
    Nein: false,
  };
  if (!JaNeinValues.hasOwnProperty(val)) {
    throw new Error(`Unbekannter Wert für boolean: ${val}`);
  }
  return JaNeinValues[val];
};

const FrontendDateFormat = "dd.MM.yyyy";
const FrontendDateRegex = /^\d{2}.\d{2}.\d{4}$/;

const toISODate = (val: string | undefined): string | null => {
  console.log(`toISODate ${val}`);
  if (!val) {
    console.log(`toISODate return null`);
    return null;
  }
  const parsedDate = parse(val, FrontendDateFormat, new Date());
  console.log(parsedDate);
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Unbekannter Wert für TT.MM.JJJJ Datum: ${val}`);
  }
  return parsedDate.toISOString();
};

const isoDateToDE = (isoDate: string | null) => {
  if (isoDate !== null) {
    const date = new Date(isoDate);
    return format(date, FrontendDateFormat);
  }
  return "";
};

const hints = {
  required: "Pflichtfeld",
  positive: "Muss größer als 0 sein",
  dateFormat: "Datum im Format TT.MM.JJJJ",
  min: (min: number) => `Mindestens ${min} Zeichen`,
  max: (max: number) => `Maximal ${max} Zeichen`,
}

// Base schema for all RecallEntry objects, frontend oriented
export const RecallEntry = z.object({
  id: z.number().int().positive(),
  created_at: z.date(),

  patient_id: z.coerce.number({
    invalid_type_error: "Muss eine positive Zahl sein.", // This message applies if coercion fails
  }).int().positive(hints.positive),
  vorname: z.string().trim().min(1, hints.required),
  nachname: z.string().trim().min(1, hints.required),
  geburtsdatum: z.string().trim().regex(FrontendDateRegex, hints.dateFormat),

  erinnerungsanlass: z.string().trim().min(1, hints.required),
  recallsystem: z.string().trim().min(1, hints.required),
  kontaktinfo: z.string().trim().default(""),
  periodicity_interval: z.coerce.number().int().positive(hints.positive),
  periodicity_unit: z.string().trim().min(1, hints.required),

  recall_target_datum: z.string().trim().regex(FrontendDateRegex, hints.dateFormat),
  reminder_send_date: z.string().trim().regex(FrontendDateRegex, hints.dateFormat),
  responsible_person: z.string().trim().default(""),
  rueckmeldung_erhalten: z.string().trim().min(1, hints.required),

  sms_template: z.string().trim().default(""),
  email_template: z.string().trim().default(""),
  letter_template: z.string().trim().default(""),

  recall_done: z.string().trim().min(1, hints.required),

  naechster_termin: z.union([
    z.literal(''), // empty string
    z.string().trim().regex(FrontendDateRegex, `${hints.dateFormat} oder leer`)
  ]).default(""),
  appointment_status: z.string().trim().min(1, hints.required),
  zusaetzliche_laborwerte: z.string().trim().default(""),
  zusaetzliche_diagnostik: z.string().trim().default(""),
  bemerkungen: z.string().trim().default(""),
})

export const RecallEntryCreateFrontend = RecallEntry.omit({id: true, created_at: true})

export const RecallEntrySchemaAPICreate = RecallEntryCreateFrontend.extend({

  // object handed to the Recall creation API
  // all dates are transformed from DE locale to ISO string
  // Ja/Nein fields are converted to boolean
  geburtsdatum: z.string().trim().transform(toISODate),

  recall_target_datum: z.string().trim().transform(toISODate),
  reminder_send_date: z.string().trim().transform(toISODate),
  rueckmeldung_erhalten: z
    .string()
    .trim()
    .transform(jaNeinToBoolean),

  recall_done: z.string().trim().transform(jaNeinToBoolean),

  naechster_termin: z.nullable(
    z
    .string()
    .trim()
    .transform(toISODate)
  ),
})

export const RecallEntrySchemaDBCreate = RecallEntrySchemaAPICreate.extend({
  geburtsdatum: z.string().trim().transform(toDate),

  recall_target_datum: z.string().trim().transform(toDate),
  reminder_send_date: z.string().trim().transform(toDate),
  rueckmeldung_erhalten: z.boolean().default(false),

  recall_done: z.boolean().default(false),

  naechster_termin: z.string().trim().nullable().optional().transform(toDate),
});

// update schemas are like creation schemas, but everything optional, and some fields excluded
export const RecallEntrySchemaDBUpdate = RecallEntrySchemaDBCreate
  .partial()
  .omit({});

export const RecallEntrySchemaAPIUpdate = RecallEntrySchemaAPICreate
  .partial()
  .omit({})

export const RecallEntrySchemaAPIRead = RecallEntry.extend({
  // add auto-generated fields
  // convert created_at to date
  // convert other dates to DE local string
  // convert boolean to Ja/Nein
  created_at: z.string().trim().transform(toDate),

  // dates
  geburtsdatum: z.string().trim().transform(isoDateToDE),
  recall_target_datum: z.string().trim().transform(isoDateToDE),
  reminder_send_date: z.string().trim().transform(isoDateToDE),
  naechster_termin: z
    .string()
    .trim()
    .nullable() // null in DB, transformed to empty string in frontend
    .transform(isoDateToDE),

  // booleans
  rueckmeldung_erhalten: z.coerce
    .boolean()
    .transform((x) => (x ? "Ja" : "Nein")),
  recall_done: z.coerce.boolean().transform((x) => (x ? "Ja" : "Nein")),
});

export type TRecallEntrySchemaAPIRead = z.infer<typeof RecallEntrySchemaAPIRead>;
export type TRecallEntry = z.infer<typeof RecallEntry>;
export type TRecallEntryCreateFrontend = z.infer<typeof RecallEntryCreateFrontend>;
export type TRecallEntrySchemaAPIUpdate = z.infer<typeof RecallEntrySchemaAPIUpdate>;

// Function to get an array of keys from the Zod schema
export function getSchemaKeys<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
): (keyof z.infer<z.ZodObject<T>> & string)[] {
  return Object.keys(schema.shape) as (keyof z.infer<z.ZodObject<T>> &
    string)[];
}
