export const siteName = 'Passphrase'
export const siteUrl = 'https://passphrase.fr'
export const defaultOgImage = '/images/passphrase-thumbnail.png'

export function absoluteUrl(path = '/'): string {
  return new URL(path, siteUrl).toString()
}
