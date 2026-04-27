export const SEPARATOR_OPTIONS = ['random', '-', '_', ' ', '*', '/', '+'] as const
export const SPECIAL_CHARACTER_OPTIONS = [
  'random',
  'none',
  '$',
  '!',
  '#',
  '?',
  '-',
  '+',
  '@',
  ',',
  ';',
  ':',
  '*'
] as const

export type SeparatorOption = (typeof SEPARATOR_OPTIONS)[number]
export type SpecialCharacterOption = (typeof SPECIAL_CHARACTER_OPTIONS)[number]
export type EntropyLevel = 'very-weak' | 'weak' | 'medium' | 'good' | 'strong' | 'very-strong'

export interface GenerationOptions {
  nb_mots: number
  longueur_minimale: number
  separateur: SeparatorOption
  majuscule_debut: boolean
  majuscule_aleatoire: boolean
  longueur_nombre: number
  caractere_special: SpecialCharacterOption
  caracteres_accentues: boolean
}

export interface GeneratedPassword {
  password: string
  entropy?: number
  class?: EntropyLevel
}

export const DEFAULT_GENERATION_OPTIONS: GenerationOptions = {
  nb_mots: 2,
  separateur: 'random',
  majuscule_debut: true,
  majuscule_aleatoire: false,
  longueur_nombre: 2,
  caractere_special: 'random',
  longueur_minimale: 12,
  caracteres_accentues: true
}

export const HOME_PASSWORD_COUNT = 10
export const ACCENTED_CHARSET_SIZE = 11
export const SEPARATOR_CHARACTERS = ['-', '_', ' ', '*', '/', '+'] as const
export const SPECIAL_CHARACTERS = ['$', '!', '#', '?', '-', '+', '@', ',', ';', ':', '*'] as const

export const NUMBER_OF_WORD_OPTIONS = [2, 3, 4, 5, 6, 7] as const
export const NUMBER_SUFFIX_OPTIONS = [0, 1, 2, 3, 4, 5] as const
export const MINIMUM_LENGTH_RANGE = { min: 8, max: 50 } as const

export const NUMBER_OF_WORD_CHOICES = NUMBER_OF_WORD_OPTIONS.map(value => ({
  label: `${value} mots`,
  value
}))

export const NUMBER_SUFFIX_CHOICES = NUMBER_SUFFIX_OPTIONS.map(value => ({
  label: value <= 1 ? `${value} chiffre` : `${value} chiffres`,
  value
}))

export const SEPARATOR_CHOICES: Array<{ label: string, value: SeparatorOption }> = [
  { label: 'Aléatoire', value: 'random' },
  { label: 'Tiret (-)', value: '-' },
  { label: 'Underscore (_)', value: '_' },
  { label: 'Espace', value: ' ' },
  { label: 'Étoile (*)', value: '*' },
  { label: 'Slash (/)', value: '/' },
  { label: 'Plus (+)', value: '+' }
]

export const SPECIAL_CHARACTER_CHOICES: Array<{ label: string, value: SpecialCharacterOption }> = [
  { label: 'Aléatoire', value: 'random' },
  { label: 'Aucun', value: 'none' },
  { label: 'Dollar ($)', value: '$' },
  { label: 'Exclamation (!)', value: '!' },
  { label: 'Croisillon (#)', value: '#' },
  { label: 'Point d’interrogation (?)', value: '?' },
  { label: 'Tiret (-)', value: '-' },
  { label: 'Plus (+)', value: '+' },
  { label: 'Arobase (@)', value: '@' },
  { label: 'Virgule (,)', value: ',' },
  { label: 'Point-virgule (;)', value: ';' },
  { label: 'Deux-points (:)', value: ':' },
  { label: 'Étoile (*)', value: '*' }
]

const entropyThresholds: Array<{ max: number, value: EntropyLevel }> = [
  { max: 80, value: 'very-weak' },
  { max: 100, value: 'weak' },
  { max: 110, value: 'medium' },
  { max: 120, value: 'good' },
  { max: 130, value: 'strong' }
]

export function cloneGenerationOptions(options: GenerationOptions): GenerationOptions {
  return { ...options }
}

export function serializeGenerationOptions(options: GenerationOptions): Record<string, string | number | boolean> {
  return {
    nb_mots: options.nb_mots,
    longueur_minimale: options.longueur_minimale,
    separateur: options.separateur,
    majuscule_debut: options.majuscule_debut,
    majuscule_aleatoire: options.majuscule_aleatoire,
    longueur_nombre: options.longueur_nombre,
    caractere_special: options.caractere_special,
    caracteres_accentues: options.caracteres_accentues
  }
}

export function normalizeGenerationOptions(input: Partial<GenerationOptions> | Record<string, unknown> | null | undefined): GenerationOptions {
  return {
    nb_mots: parseIntegerChoice(input?.nb_mots, NUMBER_OF_WORD_OPTIONS, DEFAULT_GENERATION_OPTIONS.nb_mots),
    longueur_minimale: clampNumber(parseInteger(input?.longueur_minimale, DEFAULT_GENERATION_OPTIONS.longueur_minimale), MINIMUM_LENGTH_RANGE.min, MINIMUM_LENGTH_RANGE.max),
    separateur: parseStringChoice(input?.separateur, SEPARATOR_OPTIONS, DEFAULT_GENERATION_OPTIONS.separateur),
    majuscule_debut: parseBoolean(input?.majuscule_debut, DEFAULT_GENERATION_OPTIONS.majuscule_debut),
    majuscule_aleatoire: parseBoolean(input?.majuscule_aleatoire, DEFAULT_GENERATION_OPTIONS.majuscule_aleatoire),
    longueur_nombre: parseIntegerChoice(input?.longueur_nombre, NUMBER_SUFFIX_OPTIONS, DEFAULT_GENERATION_OPTIONS.longueur_nombre),
    caractere_special: parseStringChoice(input?.caractere_special, SPECIAL_CHARACTER_OPTIONS, DEFAULT_GENERATION_OPTIONS.caractere_special),
    caracteres_accentues: parseBoolean(input?.caracteres_accentues, DEFAULT_GENERATION_OPTIONS.caracteres_accentues)
  }
}

export function parseRequestedCount(input: unknown, fallback = 1): number {
  const parsed = parseInteger(input, fallback)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function generatePasswords(
  input: Partial<GenerationOptions> | Record<string, unknown>,
  words: string[],
  count = HOME_PASSWORD_COUNT,
  withEntropy = true
): GeneratedPassword[] {
  const options = normalizeGenerationOptions(input)
  const passwords: GeneratedPassword[] = []

  for (let index = 0; index < count; index += 1) {
    let password = ''

    do {
      const passwordParts = Array.from({ length: options.nb_mots }, () => transformWord(sample(words), options))
      const separator = resolveRuntimeSeparator(options.separateur)

      password = passwordParts.join(separator)

      if (options.longueur_nombre > 0) {
        password += generateNumberSuffix(options.longueur_nombre)
      }

      const specialCharacter = resolveRuntimeSpecialCharacter(options.caractere_special)

      if (specialCharacter) {
        password += specialCharacter
      }
    } while (Array.from(password).length < options.longueur_minimale)

    if (withEntropy) {
      const entropy = calculateEntropy(password, options)

      passwords.push({
        password,
        entropy,
        class: getEntropyLevel(entropy)
      })
    } else {
      passwords.push({ password })
    }
  }

  return passwords
}

export function calculateEntropy(password: string, options: GenerationOptions): number {
  const punctuationCharacters = new Set([
    ...resolveSeparatorPool(options.separateur),
    ...resolveSpecialCharacterPool(options.caractere_special)
  ])

  let charsetSize = 26

  if (options.majuscule_debut || options.majuscule_aleatoire) {
    charsetSize += 26
  }

  if (options.longueur_nombre > 0) {
    charsetSize += 10
  }

  if (options.caracteres_accentues) {
    charsetSize += ACCENTED_CHARSET_SIZE
  }

  charsetSize += punctuationCharacters.size

  return Math.round(Array.from(password).length * Math.log2(charsetSize))
}

export function getEntropyLevel(entropy: number): EntropyLevel {
  for (const threshold of entropyThresholds) {
    if (entropy < threshold.max) {
      return threshold.value
    }
  }

  return 'very-strong'
}

function transformWord(word: string, options: GenerationOptions): string {
  let transformed = options.caracteres_accentues ? word : stripAccents(word)

  if (options.majuscule_debut) {
    transformed = capitalizeWord(transformed)
  }

  if (options.majuscule_aleatoire) {
    transformed = uppercaseRandomCharacter(transformed)
  }

  return transformed
}

function capitalizeWord(word: string): string {
  const characters = Array.from(word)

  if (characters.length === 0) {
    return word
  }

  characters[0] = characters[0]!.toLocaleUpperCase('fr-FR')

  return characters.join('')
}

function uppercaseRandomCharacter(word: string): string {
  const characters = Array.from(word)

  if (characters.length === 0) {
    return word
  }

  const position = randomInt(0, characters.length - 1)
  characters[position] = characters[position]!.toLocaleUpperCase('fr-FR')

  return characters.join('')
}

function stripAccents(word: string): string {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFC')
}

function generateNumberSuffix(length: number): string {
  const max = 10 ** length
  const value = randomInt(0, max - 1)

  return value.toString().padStart(length, '0')
}

function resolveRuntimeSeparator(option: SeparatorOption): string {
  return option === 'random' ? sample([...SEPARATOR_CHARACTERS]) : option
}

function resolveRuntimeSpecialCharacter(option: SpecialCharacterOption): string {
  if (option === 'none') {
    return ''
  }

  return option === 'random' ? sample([...SPECIAL_CHARACTERS]) : option
}

function resolveSeparatorPool(option: SeparatorOption): string[] {
  return option === 'random' ? [...SEPARATOR_CHARACTERS] : [option]
}

function resolveSpecialCharacterPool(option: SpecialCharacterOption): string[] {
  if (option === 'none') {
    return []
  }

  return option === 'random' ? [...SPECIAL_CHARACTERS] : [option]
}

function sample<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)]!
}

function randomInt(min: number, max: number): number {
  const range = max - min + 1

  // Rejection sampling to remove modulo bias on a 32-bit CSPRNG output.
  // Discard draws that fall in the small "tail" beyond the largest
  // multiple of range that fits in 2^32, then take modulo on what's left.
  const ceiling = Math.floor(0x1_0000_0000 / range) * range
  const buffer = new Uint32Array(1)

  let value: number
  do {
    crypto.getRandomValues(buffer)
    value = buffer[0]!
  } while (value >= ceiling)

  return min + (value % range)
}

function parseInteger(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value)
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseInt(value, 10)

    return Number.isNaN(parsed) ? fallback : parsed
  }

  return fallback
}

function parseIntegerChoice(value: unknown, choices: readonly number[], fallback: number): number {
  const parsed = parseInteger(value, fallback)
  return choices.includes(parsed) ? parsed : fallback
}

function parseStringChoice<T extends string>(value: unknown, choices: readonly T[], fallback: T): T {
  if (typeof value === 'string' && choices.includes(value as T)) {
    return value as T
  }

  return fallback
}

function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  if (typeof value !== 'string') {
    return fallback
  }

  const normalized = value.trim().toLowerCase()

  if (normalized === '') {
    return false
  }

  if (['1', 'true', 'on', 'yes'].includes(normalized)) {
    return true
  }

  if (['0', 'false', 'off', 'no'].includes(normalized)) {
    return false
  }

  return false
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
