const BOM = '﻿'

let cachedWords: string[] | null = null

export async function getDictionaryWords(): Promise<string[]> {
  if (cachedWords) {
    return cachedWords
  }

  const content = await useStorage('assets:server').getItem<string>('db.csv')
  if (!content) {
    throw new Error('Dictionary asset not found: assets:server/db.csv')
  }

  const stripped = content.startsWith(BOM) ? content.slice(1) : content

  cachedWords = stripped
    .split(/\r?\n/u)
    .map(word => word.trim())
    .filter(Boolean)

  return cachedWords ?? []
}
