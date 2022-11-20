/**
 * To lowercase en removes spaces
 */
export function normalizeString(input: string): string {
  return input?.toLowerCase().split(' ').join('');
}

/**
 * From CamelCase to title
 */
export function camelCaseToTitle(input: string): string {
  const result = input.replace(/([A-Z])/g, ' $1').toLowerCase();
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function joinNonFalsyStrings(strings: string[]): string {
  return strings.filter(id => !!id).join('_');
}
