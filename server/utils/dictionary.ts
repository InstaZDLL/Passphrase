import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dictionaryPath = resolve(process.cwd(), 'server/data/db.csv')

let cachedWords: string[] | null = null

export async function getDictionaryWords(): Promise<string[]> {
  if (cachedWords) {
    return cachedWords
  }

  const content = await readFile(dictionaryPath, 'utf8')

  cachedWords = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/u)
    .map((word: string) => word.trim())
    .filter(Boolean)

  return cachedWords ?? []
}
