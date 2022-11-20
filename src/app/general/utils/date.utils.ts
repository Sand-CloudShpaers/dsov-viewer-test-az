const YEAR_OFFSET = 10000;
const MONTH_OFFSET = 100;

/**
 *
 * @param input
 *
 * Maak een datum string in datumformaat dd-MM-YYYY
 */
export function formattedDate(input: string | Date): string {
  return new Date(input).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function toComparableNumber(date: Date): number {
  /*
   Note: getMonth() starts to count at 0 for January. For the purpose of this function (returning
   a number that is always higher when the date is more recent) this is no problem.
   */
  return date.getFullYear() * YEAR_OFFSET + date.getMonth() * MONTH_OFFSET + date.getDay();
}

/**
 *
 * @param date a string with '-' as date-month-year separator
 *
 * dd-MM-YYYY => YYYY-MM-dd
 */
export function reverseDateString(date: string): string {
  // eslint-disable-next-line etc/no-assign-mutated-array
  return date.split('-').reverse().join('-');
}

/**
 *
 * @param input
 * @param withSeconds
 *
 * Deze functie formateerd de input datum eerst naar dd-MM-YYYY (formattedDate), daarna naar YYYY-MM-dd
 * (reverseDateString) en voegt vervolgens de tijd (T) uren en minuten incl. voorloop 0 in timezone Z toe.
 * Indien withSeconds true is wordt ':00' aan de returnwaarde toegevoegd.
 *
 * Dit format wordt gebruikt voor tijdreis queryparameter 'beschikbaarOp' bij OZON en IHR bevragingen.
 */
export function formattedDateTime(input: Date, withSeconds = false): string {
  const hours = new Date(input).getUTCHours();
  const minutes = new Date(input).getUTCMinutes();
  const seconds = withSeconds ? ':00' : '';
  return `${reverseDateString(formattedDate(input))}T${hours < 10 ? '0' : ''}${hours}:${
    minutes < 10 ? '0' : ''
  }${minutes}${seconds}Z`;
}
