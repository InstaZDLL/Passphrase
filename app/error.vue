<script setup lang="ts">
import { siteName } from './data/site'

const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

const statusCode = computed(() => props.error?.statusCode ?? 500)
const isNotFound = computed(() => statusCode.value === 404)

const title = computed(() => isNotFound.value ? 'Page introuvable' : 'Une erreur est survenue')
const description = computed(() =>
  isNotFound.value
    ? 'La page que tu cherches a été déplacée ou n’a jamais existé.'
    : 'Quelque chose ne s’est pas passé comme prévu de notre côté. Réessaie dans un instant.'
)

useHead({
  htmlAttrs: { lang: 'fr' }
})

useSeoMeta({
  title: `${title.value} · ${siteName}`,
  description: description.value,
  robots: 'noindex'
})

function handleHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <div class="error-page__inner reveal-up">
      <p class="eyebrow">
        Erreur {{ statusCode }}
      </p>
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>

      <button
        type="button"
        class="primary-button"
        @click="handleHome"
      >
        Revenir à l’accueil
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  display: grid;
  place-items: center;
  min-height: 100svh;
  padding: 4rem 1.25rem;
  background: var(--page-bg);
  color: var(--page-ink);
}

.error-page__inner {
  width: min(36rem, 100%);
  text-align: center;
}

.error-page h1 {
  margin: 0.5rem 0 1rem;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 6vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.error-page p {
  color: var(--page-muted);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.error-page .primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.95rem 1.5rem;
  border: 0;
  border-radius: 999px;
  background: var(--surface-dark);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: transform 180ms ease, background-color 180ms ease;
}

.error-page .primary-button:hover {
  transform: translateY(-1px);
  background: #2c3a4a;
}
</style>
