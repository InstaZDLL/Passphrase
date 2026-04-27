<script setup lang="ts">
import { absoluteUrl, defaultOgImage, siteName, siteUrl } from '../data/site'
import type { GeneratedPassword, GenerationOptions } from '#shared/passphrase'
import {
  cloneGenerationOptions,
  DEFAULT_GENERATION_OPTIONS,
  HOME_PASSWORD_COUNT,
  MINIMUM_LENGTH_RANGE,
  normalizeGenerationOptions,
  NUMBER_OF_WORD_CHOICES,
  NUMBER_SUFFIX_CHOICES,
  SEPARATOR_CHOICES,
  serializeGenerationOptions,
  SPECIAL_CHARACTER_CHOICES
} from '#shared/passphrase'

interface PasswordPreviewResponse {
  passwords: GeneratedPassword[]
}

const title = 'Générateur de passphrases françaises'
const description = 'Génère des passphrases françaises mémorisables, calcule leur entropie et expose une API compatible pour les intégrations existantes.'
const canonicalUrl = absoluteUrl('/')
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': siteName,
  'url': canonicalUrl,
  'inLanguage': 'fr',
  'potentialAction': {
    '@type': 'SearchAction',
    'target': `${siteUrl}/api/passwords?count=1&nb_mots={nb_mots}`,
    'query-input': 'required name=nb_mots'
  }
}
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  'name': siteName,
  'applicationCategory': 'SecurityApplication',
  'operatingSystem': 'Any',
  'url': canonicalUrl,
  'inLanguage': 'fr',
  'description': description,
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'EUR'
  }
}

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ],
  script: [
    {
      id: 'passphrase-home-website-schema',
      type: 'application/ld+json',
      textContent: JSON.stringify(websiteSchema)
    },
    {
      id: 'passphrase-home-webapp-schema',
      type: 'application/ld+json',
      textContent: JSON.stringify(webApplicationSchema)
    }
  ]
})

useSeoMeta({
  title,
  description,
  ogUrl: canonicalUrl,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogImage: absoluteUrl(defaultOgImage),
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: absoluteUrl(defaultOgImage),
  twitterCard: 'summary_large_image'
})

const preferencesCookie = useCookie<GenerationOptions>('user_preferences', {
  default: () => cloneGenerationOptions(DEFAULT_GENERATION_OPTIONS),
  maxAge: 60 * 60 * 24 * 30,
  sameSite: 'lax'
})

const initialOptions = normalizeGenerationOptions(preferencesCookie.value)
const form = reactive(cloneGenerationOptions(initialOptions))
const pending = ref(false)
const requestError = ref('')
const apiExampleCopied = ref(false)
const passwordRevision = ref(0)

const { data: initialResponse } = await useAsyncData<PasswordPreviewResponse>('initial-passwords', () =>
  $fetch('/api/passwords/preview', {
    query: {
      ...serializeGenerationOptions(initialOptions),
      count: HOME_PASSWORD_COUNT
    }
  })
)

const passwords = ref<GeneratedPassword[]>(initialResponse.value?.passwords ?? [])

const entropyLegend = [
  { label: 'Très faible', value: '< 80 bits', level: 'very-weak' },
  { label: 'Faible', value: '< 100 bits', level: 'weak' },
  { label: 'Moyen', value: '< 110 bits', level: 'medium' },
  { label: 'Bon', value: '< 120 bits', level: 'good' },
  { label: 'Fort', value: '< 130 bits', level: 'strong' },
  { label: 'Très fort', value: '≥ 130 bits', level: 'very-strong' }
] as const

const apiExampleUrl = computed(() => {
  const searchParams = new URLSearchParams()
  const query = {
    ...serializeGenerationOptions(form),
    count: 1
  }

  Object.entries(query).forEach(([key, value]) => {
    searchParams.set(key, String(value))
  })

  return `/api/passwords?${searchParams.toString()}`
})

async function regeneratePasswords() {
  pending.value = true
  requestError.value = ''

  const normalized = normalizeGenerationOptions(form)
  Object.assign(form, normalized)
  preferencesCookie.value = cloneGenerationOptions(normalized)

  try {
    const response = await $fetch<PasswordPreviewResponse>('/api/passwords/preview', {
      query: {
        ...serializeGenerationOptions(normalized),
        count: HOME_PASSWORD_COUNT
      }
    })

    passwords.value = response.passwords
    passwordRevision.value += 1
  } catch {
    requestError.value = 'La génération a échoué. Réessaie dans quelques secondes.'
  } finally {
    pending.value = false
  }
}

async function resetToDefaults() {
  Object.assign(form, cloneGenerationOptions(DEFAULT_GENERATION_OPTIONS))
  await regeneratePasswords()
}

async function copyApiExample() {
  await navigator.clipboard.writeText(apiExampleUrl.value)
  apiExampleCopied.value = true

  window.setTimeout(() => {
    apiExampleCopied.value = false
  }, 1400)
}
</script>

<template>
  <main class="flex-1">
    <section class="reveal-up max-w-6xl mx-auto text-center px-4 pt-24 pb-16 md:pt-32 md:pb-24">
      <p class="eyebrow">
        Générateur de passphrases françaises
      </p>
      <h1 class="font-display text-gray-900 leading-[1.1] text-4xl sm:text-5xl md:text-6xl mb-8 text-balance">
        Des mots de passe plus lisibles, plus mémorisables, toujours costauds.
      </h1>
      <p class="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Compose 10 passphrases en un clic, compare leur entropie et conserve tes préférences sans retomber dans une interface vieillissante.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#generator"
          class="w-full sm:w-auto px-8 py-4 bg-gray-900 !text-white rounded-full font-bold hover:-translate-y-0.5 hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20"
        >
          Générer maintenant
        </a>
        <NuxtLink
          to="/blog/entropie"
          class="w-full sm:w-auto px-8 py-4 bg-white/60 border border-gray-200 text-gray-900 rounded-full font-bold hover:bg-white transition-all backdrop-blur-sm"
        >
          Comprendre l’entropie
        </NuxtLink>
      </div>
    </section>

    <section
      id="generator"
      class="max-w-7xl mx-auto px-4 pb-24"
    >
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <form
          class="reveal-up lg:col-span-5 border border-gray-200/60 bg-[var(--surface-main)] backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 lg:sticky lg:top-28"
          @submit.prevent="regeneratePasswords"
        >
          <div class="flex items-center justify-between mb-8">
            <div>
              <p class="eyebrow !mb-1">
                Préférences
              </p>
              <h3 class="font-display text-2xl text-gray-900">
                Personnalise ton schéma
              </h3>
            </div>

            <button
              type="button"
              class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              @click="resetToDefaults"
            >
              Réinitialiser
            </button>
          </div>

          <div class="generator-form !mt-0 mb-6">
            <label class="field">
              <span>Nombre de mots</span>
              <select v-model.number="form.nb_mots">
                <option
                  v-for="option in NUMBER_OF_WORD_CHOICES"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>

            <label class="field">
              <span>Séparateur</span>
              <select v-model="form.separateur">
                <option
                  v-for="option in SEPARATOR_CHOICES"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>

            <label class="field">
              <span>Chiffres finaux</span>
              <select v-model.number="form.longueur_nombre">
                <option
                  v-for="option in NUMBER_SUFFIX_CHOICES"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>

            <label class="field">
              <span>Caractère final</span>
              <select v-model="form.caractere_special">
                <option
                  v-for="option in SPECIAL_CHARACTER_CHOICES"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>

            <label class="field field--wide">
              <span>Longueur minimale</span>
              <input
                v-model.number="form.longueur_minimale"
                type="number"
                :min="MINIMUM_LENGTH_RANGE.min"
                :max="MINIMUM_LENGTH_RANGE.max"
              >
            </label>
          </div>

          <div class="toggle-grid !mt-0 mb-8">
            <label class="toggle">
              <input
                v-model="form.majuscule_debut"
                type="checkbox"
              >
              <span>Majuscule en début de mot</span>
            </label>

            <label class="toggle">
              <input
                v-model="form.majuscule_aleatoire"
                type="checkbox"
              >
              <span>Majuscule aléatoire</span>
            </label>

            <label class="toggle">
              <input
                v-model="form.caracteres_accentues"
                type="checkbox"
              >
              <span>Conserver les accents</span>
            </label>
          </div>

          <button
            type="submit"
            class="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            :disabled="pending"
          >
            <span
              v-if="pending"
              class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
            />
            {{ pending ? 'Génération…' : 'Générer 10 passphrases' }}
          </button>

          <p
            v-if="requestError"
            class="form-error mt-4"
          >
            {{ requestError }}
          </p>
        </form>

        <PassphrasePasswordList
          :items="passwords"
          :pending="pending"
          :revision="passwordRevision"
          class="lg:col-span-7"
        />
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 pb-24 grid md:grid-cols-2 gap-8 items-start">
      <div class="reveal-up border border-gray-200/60 bg-[var(--surface-main)] backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm">
        <p class="eyebrow">
          Lecture rapide
        </p>
        <h2 class="font-display text-3xl md:text-4xl text-gray-900 mb-6">
          Une échelle d’entropie lisible au premier regard.
        </h2>

        <div class="grid">
          <div
            v-for="item in entropyLegend"
            :key="item.level"
            class="flex items-center gap-4 py-3 border-t border-gray-200/60 first:border-t-0"
          >
            <span
              class="legend-dot"
              :data-level="item.level"
            />
            <div>
              <p class="font-bold text-gray-900">
                {{ item.label }}
              </p>
              <span class="text-sm text-gray-500">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        id="api"
        class="reveal-up border border-gray-200/60 bg-[var(--surface-main)] backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm"
      >
        <p class="eyebrow">
          API
        </p>
        <h2 class="font-display text-3xl md:text-4xl text-gray-900 mb-4">
          La route historique reste en place.
        </h2>
        <p class="text-gray-600 leading-relaxed mb-6">
          <code>GET /api/passwords</code> conserve les paramètres publics existants pour ne pas casser les intégrations déjà en circulation.
        </p>

        <pre class="bg-gray-900 rounded-xl p-4 text-gray-100 text-sm overflow-x-auto whitespace-pre-wrap break-all mb-6 font-mono">{{ apiExampleUrl }}</pre>

        <div class="flex flex-wrap gap-3 items-center">
          <button
            type="button"
            class="px-5 py-2.5 border border-gray-200 bg-white/60 text-gray-900 rounded-full font-medium hover:bg-white transition-colors"
            @click="copyApiExample"
          >
            {{ apiExampleCopied ? 'Copié' : 'Copier l’exemple' }}
          </button>

          <a
            class="px-5 py-2.5 border border-gray-200 bg-white/60 text-gray-900 rounded-full font-medium hover:bg-white transition-colors"
            :href="apiExampleUrl"
            target="_blank"
            rel="noreferrer noopener"
          >
            Tester l’API
          </a>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 pb-16">
      <div class="reveal-up border border-gray-200/60 bg-[var(--surface-main)] backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p class="eyebrow">
            Extension Chrome
          </p>
          <h2 class="font-display text-2xl md:text-3xl text-gray-900 mb-2">
            Besoin d’aller plus vite dans le navigateur ?
          </h2>
          <p class="text-gray-600">
            L’extension reste disponible pour générer une passphrase sans quitter ton contexte de navigation.
          </p>
        </div>

        <a
          href="https://chromewebstore.google.com/detail/g%C3%A9n%C3%A9rateur-de-passphrase/bhlgfoknmmhgpfoanhoemjccephcanjd"
          target="_blank"
          rel="noreferrer noopener"
          class="shrink-0 px-6 py-3 bg-gray-900 !text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
          Installer l’extension
        </a>
      </div>
    </section>
  </main>
</template>
