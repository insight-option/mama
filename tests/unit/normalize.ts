/** Intl inserts non-breaking spaces between currency and amount; tests compare with plain spaces. */
export function plainSpaces(text: string): string {
  return text.replace(/ /g, " ");
}
