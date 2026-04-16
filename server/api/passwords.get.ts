import { generatePasswords, normalizeGenerationOptions, parseRequestedCount } from '#shared/passphrase'
import { getDictionaryWords } from '../utils/dictionary'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const options = normalizeGenerationOptions(query)
  const count = parseRequestedCount(query.count, 1)
  const words = await getDictionaryWords()

  return {
    passwords: generatePasswords(options, words, count, false)
  }
})
