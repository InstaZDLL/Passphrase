import { generatePasswords, normalizeGenerationOptions, parseRequestedCount, HOME_PASSWORD_COUNT } from '#shared/passphrase'
import { getDictionaryWords } from '../../utils/dictionary'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const options = normalizeGenerationOptions(query)
  const count = parseRequestedCount(query.count, HOME_PASSWORD_COUNT)
  const words = await getDictionaryWords()

  return {
    passwords: generatePasswords(options, words, count, true)
  }
})
