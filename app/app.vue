<script setup lang="ts">
import { absoluteUrl, defaultOgImage, siteName } from './data/site'

const title = siteName
const description = 'Générateur de passphrases françaises moderne, lisible et orienté entropie.'
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': siteName,
  'url': absoluteUrl('/'),
  'logo': absoluteUrl('/favicon.ico')
}

useHead({
  htmlAttrs: {
    lang: 'fr'
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap'
    }
  ],
  script: [
    {
      id: 'passphrase-organization-schema',
      type: 'application/ld+json',
      textContent: JSON.stringify(organizationSchema)
    }
  ]
})

useSeoMeta({
  titleTemplate: titleChunk => titleChunk ? `${titleChunk} · ${title}` : title,
  description,
  applicationName: title,
  ogLocale: 'fr_FR',
  ogSiteName: title,
  ogImage: absoluteUrl(defaultOgImage),
  twitterCard: 'summary_large_image'
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="app-shell">
    <NuxtLoadingIndicator color="#e77b54" />

    <header class="site-header">
      <NuxtLink
        to="/"
        class="site-brand"
      >
        <span
          class="site-brand__mark"
          aria-hidden="true"
        >P</span>
        <span>Passphrase</span>
      </NuxtLink>

      <nav
        class="site-nav"
        aria-label="Navigation principale"
      >
        <NuxtLink to="/#generator">
          Générateur
        </NuxtLink>
        <NuxtLink to="/#api">
          API
        </NuxtLink>
        <NuxtLink to="/blog/entropie">
          Entropie
        </NuxtLink>
      </nav>
    </header>

    <NuxtPage />

    <footer class="site-footer">
      <p>Passphrase © {{ currentYear }} · Génération en français, interface Nuxt modernisée.</p>
      <div class="site-footer__links">
        <a
          href="/api/passwords"
        >
          API
        </a>
        <a
          href="https://github.com/AlexandreMonchain/PassphraseChromeExtension"
          target="_blank"
          rel="noreferrer noopener"
        >
          Extension
        </a>
      </div>
    </footer>
  </div>
</template>
