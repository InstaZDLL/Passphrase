export const siteName = 'Passphrase'
export const siteUrl = 'https://www.passphrase.ch'
export const defaultOgImage = '/images/passphrase-thumbnail.webp'

export function absoluteUrl(path = '/'): string {
  return new URL(path, siteUrl).toString()
}
