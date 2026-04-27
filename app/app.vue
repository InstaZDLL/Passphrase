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
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#f7f2ea' },
    { name: 'color-scheme', content: 'light' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '16x16 32x32 48x48' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/manifest.webmanifest' }
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

    <a
      href="#main-content"
      class="skip-link"
    >
      Aller au contenu principal
    </a>

    <header class="site-header">
      <NuxtLink
        to="/"
        class="site-brand"
      >
        <svg
          class="site-brand__mark"
          viewBox="0 0 512 512"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="brand-bg"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stop-color="#263443"
              />
              <stop
                offset="100%"
                stop-color="#111827"
              />
            </linearGradient>
            <linearGradient
              id="brand-accent"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stop-color="#e77b54"
              />
              <stop
                offset="100%"
                stop-color="#d96541"
              />
            </linearGradient>
          </defs>
          <rect
            width="512"
            height="512"
            rx="128"
            fill="url(#brand-bg)"
          />
          <path
            d="M 130 116 H 260 A 120 120 0 0 1 260 356 H 190 V 396 H 130 Z"
            fill="#ffffff"
          />
          <circle
            cx="260"
            cy="236"
            r="46"
            fill="url(#brand-accent)"
          />
        </svg>
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
        <a href="/api/passwords">
          API
        </a>
        <NuxtLink to="/privacy">
          Confidentialité
        </NuxtLink>
        <a
          href="https://chromewebstore.google.com/detail/g%C3%A9n%C3%A9rateur-de-passphrase/bhlgfoknmmhgpfoanhoemjccephcanjd"
          target="_blank"
          rel="noreferrer noopener"
        >
          Extension
        </a>
      </div>
    </footer>
  </div>
</template>
