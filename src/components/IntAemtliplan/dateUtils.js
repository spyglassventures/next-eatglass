import { addDays, addMonths, isWithinInterval } from 'date-fns';

export const getOccurrencesWithinRange = (duty, startDate, endDate) => {
    let nextOccurrence = new Date(duty.startDate);
    const occurrences = [];

    while (nextOccurrence <= endDate) {
        if (isWithinInterval(nextOccurrence, { start: startDate, end: endDate })) {
            occurrences.push(nextOccurrence);
        }

        switch (duty.frequency) {
            case 'week':
                nextOccurrence = addDays(nextOccurrence, 7 * duty.interval);
                break;
            case 'month':
                nextOccurrence = addMonths(nextOccurrence, duty.interval);
                break;
            case 'quarter':
                nextOccurrence = addMonths(nextOccurrence, 3 * duty.interval);
                break;
            case 'half-year':
                nextOccurrence = addMonths(nextOccurrence, 6 * duty.interval);
                break;
            default:
                return [];
        }
    }

    return occurrences;
};
