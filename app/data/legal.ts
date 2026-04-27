// Centralized legal information used by the /privacy page.
// Update the email below before going live.

export const legalInfo = {
  contactEmail: 'contact@passphrase.ch',
  lastUpdated: '2026-04-27'
} as const

export function formatLastUpdated(date = legalInfo.lastUpdated): string {
  return new Intl.DateTimeFormat('fr-CH', { dateStyle: 'long' }).format(new Date(date))
}
