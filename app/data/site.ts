export const siteName = 'Passphrase'
export const siteUrl = 'https://www.passphrase.ch'
export const defaultOgImage = '/og-image.png'

export function absoluteUrl(path = '/'): string {
  return new URL(path, siteUrl).toString()
}
