// https://nuxt.com/docs/api/configuration/nuxt-config
const isProduction = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/a11y',
    '@nuxt/hints',
    'nuxt-security'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-01-15',

  security: {
    enabled: isProduction,
    nonce: true,
    corsHandler: false,
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'nonce-{{nonce}}'", "'report-sample'", 'https://va.vercel-scripts.com'],
        'style-src': ["'self'", "'nonce-{{nonce}}'", "'report-sample'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'connect-src': ["'self'", 'https://va.vercel-scripts.com', 'https://vitals.vercel-insights.com'],
        'font-src': ["'self'"],
        'frame-src': ["'self'"],
        'img-src': ["'self'"],
        'manifest-src': ["'self'"],
        'media-src': ["'self'"],
        'worker-src': ["'none'"],
        'report-uri': ['https://69ef176f4cc6185ca2e50da1.endpoint.csper.io?builder=true&v=2']
      },
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true
      },
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'DENY',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
        'interest-cohort': []
      },
      crossOriginEmbedderPolicy: 'unsafe-none',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'same-origin'
    },
    ssg: {
      meta: true,
      hashScripts: true,
      hashStyles: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
