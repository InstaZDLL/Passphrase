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
  <main class="home-page">
    <section class="hero">
      <div class="hero__aurora hero__aurora--left" />
      <div class="hero__aurora hero__aurora--right" />

      <div class="hero__content reveal-up">
        <p class="eyebrow">
          Générateur de passphrases françaises
        </p>
        <h1>
          Des mots de passe plus lisibles, plus mémorisables, toujours costauds.
        </h1>
        <p class="hero__lede">
          Compose 10 passphrases en un clic, compare leur entropie et conserve tes préférences sans retomber dans une interface vieillissante.
        </p>

        <div class="hero__actions">
          <a
            href="#generator"
            class="primary-link"
          >
            Générer maintenant
          </a>
          <NuxtLink
            to="/blog/entropie"
            class="secondary-link"
          >
            Comprendre l’entropie
          </NuxtLink>
        </div>
      </div>
    </section>

    <section
      id="generator"
      class="workspace"
    >
      <div class="workspace__intro reveal-up">
        <div>
          <p class="eyebrow">
            Workspace
          </p>
          <h2>Règle le motif, puis laisse le moteur produire le reste.</h2>
        </div>

        <p class="workspace__copy">
          Les mêmes routes publiques restent disponibles, mais l’expérience bascule dans une interface Nuxt plus directe.
        </p>
      </div>

      <div class="workspace__grid">
        <form
          class="generator-panel reveal-up"
          @submit.prevent="regeneratePasswords"
        >
          <div class="generator-panel__header">
            <div>
              <p class="eyebrow">
                Préférences
              </p>
              <h3>Personnalise ton schéma</h3>
            </div>

            <button
              type="button"
              class="ghost-button"
              @click="resetToDefaults"
            >
              Réinitialiser
            </button>
          </div>

          <div class="generator-form">
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

          <div class="toggle-grid">
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

          <div class="generator-panel__footer">
            <button
              type="submit"
              class="primary-button"
              :disabled="pending"
            >
              {{ pending ? 'Génération…' : 'Générer 10 passphrases' }}
            </button>

            <p
              v-if="requestError"
              class="form-error"
            >
              {{ requestError }}
            </p>
          </div>
        </form>

        <PassphrasePasswordList
          :items="passwords"
          :pending="pending"
          :revision="passwordRevision"
        />
      </div>
    </section>

    <section class="insights">
      <div class="insights__column reveal-up">
        <p class="eyebrow">
          Lecture rapide
        </p>
        <h2>Une échelle d’entropie lisible au premier regard.</h2>

        <div class="legend-list">
          <div
            v-for="item in entropyLegend"
            :key="item.level"
            class="legend-item"
          >
            <span
              class="legend-dot"
              :data-level="item.level"
            />
            <div>
              <p>{{ item.label }}</p>
              <span>{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        id="api"
        class="api-panel reveal-up"
      >
        <p class="eyebrow">
          API
        </p>
        <h2>La route historique reste en place.</h2>
        <p>
          `GET /api/passwords` conserve les paramètres publics existants pour ne pas casser les intégrations déjà en circulation.
        </p>

        <pre class="api-snippet">{{ apiExampleUrl }}</pre>

        <div class="api-panel__actions">
          <button
            type="button"
            class="ghost-button"
            @click="copyApiExample"
          >
            {{ apiExampleCopied ? 'Copié' : 'Copier l’exemple' }}
          </button>

          <a
            class="secondary-link"
            :href="apiExampleUrl"
            target="_blank"
            rel="noreferrer noopener"
          >
            Tester l’API
          </a>
        </div>
      </div>
    </section>

    <section class="extension-strip reveal-up">
      <div>
        <p class="eyebrow">
          Extension Chrome
        </p>
        <h2>Besoin d’aller plus vite dans le navigateur ?</h2>
        <p>
          L’extension reste disponible pour générer une passphrase sans quitter ton contexte de navigation.
        </p>
      </div>

      <a
        href="https://chromewebstore.google.com/detail/g%C3%A9n%C3%A9rateur-de-passphrase/bhlgfoknmmhgpfoanhoemjccephcanjd"
        target="_blank"
        rel="noreferrer noopener"
        class="primary-link"
      >
        Installer l’extension
      </a>
    </section>
  </main>
</template>
