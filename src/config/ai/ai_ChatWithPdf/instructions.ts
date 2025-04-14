// /src/config/ai/ai_ChatWithPdf/instructions.ts
const chatInstructions = (
    untersuchungsgrund: string,
    geschlecht: string,
    alter: string
) => `Anbei sind theoretische Kardiologische Aufnahmen (Holter EKG) zu Schulungszwecken. Schreibe einen Satz hinsichtlich den folgenden 15 Themen und berücksichtige dieses Format:

1. Untersuchungszeitraum in Tagen:  
2. Besonderer Hinweis/e für die Praxis/Klinik: 
3. Grundrhythmus
3.1 Durchschnittliche HF in bpm:
3.2 Minimale bpm (an wievielten Untersuchungstag, Uhrzeit):
4. Vorhofflimmern: z.B: Last n%  
5. Vorhofflattern: z.B: Last n% 
6. AV-Block: z.B: Last n%  
7. VES (total, isoliert, Morphologien, Couplet Morphologie, Couplets pro Tag, Triplets Total) 
8. SVES: Total und wieviel isolierte  
9. Morphologien:
10. VT Total: z.B: Last n% 
11. SVT Total: z.B: Last n%  
11.1 SVT grösser oder gleich 30 Sekunden in %. 
11.2 SVT kleiner als 30 Sekunden in %. 
12. Anzahl Pausen (Total):  
13. Anzahl Stimulierte Schläge (Total):  
14. Patientin/Patient notierte Events, patienten-aktivierte Markierungen und es korreliert mit Sinusrhythmus:
15. Beurteilung im Kontext von "${untersuchungsgrund}", Geschlecht "${geschlecht}", Alter: "${alter}". Berücksichtige z.B. Patientenalter, SVES und VES, QRS, Chronotropie, Pausen, Präsynkopen, Extrasystolie, Arrhythmien, Betablockertherapie, Frequenzspektrum, Blockierungen, Wiederholung wann sinnvoll, Belastungstest sinnvoll, TTE und Ergometrie sinnvoll, Mg2+, Kontraindikation
.

Kein Einführungssatz, kein Schlusssatz`;

export default chatInstructions;
