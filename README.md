<div align="center">

<img src="public/favicon.svg" alt="Passphrase" width="120" />

# Passphrase

[![CI](https://github.com/InstaZDLL/Passphrase/actions/workflows/ci.yml/badge.svg)](https://github.com/InstaZDLL/Passphrase/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-2C9F47?style=for-the-badge)](./LICENSE)
[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?style=for-the-badge&logo=nuxt&logoColor=white)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://www.passphrase.ch)
[![Renovate](https://img.shields.io/badge/Renovate-enabled-1A1F6C?style=for-the-badge&logo=renovatebot&logoColor=white)](https://docs.renovatebot.com/)

**Générateur de passphrases françaises mémorisables, avec calcul d'entropie et API publique.**

[Démo en ligne](https://www.passphrase.ch) · [API publique](https://www.passphrase.ch/api/passwords?count=1) · [Politique de confidentialité](https://www.passphrase.ch/privacy)

</div>

---

## Pourquoi Passphrase

Les mots de passe robustes type `xK9$mP2#vL!` sont impossibles à retenir. Une passphrase composée de mots français choisis aléatoirement (`Cerise-Voyage42$`, `Mésange/Crépuscule61?`) atteint la même entropie tout en restant lisible et mémorisable.

Passphrase génère ces combinaisons en un clic, calcule leur entropie en bits, et expose une API REST publique pour intégration depuis n'importe quel client.

## Fonctionnalités

- **Génération à la demande** : 10 variantes par requête, avec aperçu d'entropie en couleur (très faible → très fort)
- **Personnalisation complète** : nombre de mots (2 à 7), séparateur, chiffres finaux, caractère spécial, longueur minimale, accents, majuscule en début ou aléatoire
- **Calcul d'entropie en bits** selon la formule `longueur × log2(taille du jeu de caractères)`
- **API publique RESTful** sur `GET /api/passwords` avec CORS ouvert (`Access-Control-Allow-Origin: *`)
- **Préférences mémorisées** dans un cookie local (30 jours, fonctionnel, sans tracking)
- **Article pédagogique** sur l'entropie, la sécurité, et le choix d'un gestionnaire de mots de passe

## Stack technique

| Couche | Technologie |
| --- | --- |
| Framework | [Nuxt 4](https://nuxt.com) (Vue 3.5, SSR + Nitro) |
| Language | TypeScript 6 |
| UI | [Nuxt UI 4](https://ui.nuxt.com) + [Tailwind CSS 4](https://tailwindcss.com) |
| Polices | Manrope + Fraunces (self-hostées via [@nuxt/fonts](https://fonts.nuxt.com)) |
| Sécurité | [nuxt-security](https://nuxt-security.vercel.app/) (CSP avec nonce, HSTS, Permissions-Policy) |
| Analytics | [Vercel Web Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/speed-insights) |
| CI | GitHub Actions (lint, typecheck, build) |
| Deps | [Renovate](https://docs.renovatebot.com/) |
| Hébergement | [Vercel](https://vercel.com) |

## Démarrage rapide

### Prérequis

| Outil | Version |
| --- | --- |
| [Node.js](https://nodejs.org) | 22 LTS |
| [pnpm](https://pnpm.io) | 10 |

### Installation

```bash
git clone git@github.com:InstaZDLL/Passphrase.git
cd Passphrase
pnpm install
```

### Développement

```bash
pnpm dev
```

Ouvre <http://localhost:3000>. Les nonces CSP et le module `nuxt-security` sont **désactivés en dev** pour ne pas casser le hot reload Vite.

### Build production

```bash
pnpm build
pnpm start    # serveur Nitro local sur :3000
```

### Lint & typecheck

```bash
pnpm lint           # ESLint (config Nuxt + project rules)
pnpm lint:fix       # auto-fix
pnpm typecheck      # vue-tsc + tsc
```

## API publique

`GET /api/passwords` — génère 1 ou plusieurs passphrases.

### Paramètres

| Paramètre | Type | Défaut | Valeurs |
| --- | --- | --- | --- |
| `count` | int | `1` | 1–50 |
| `nb_mots` | int | `2` | 2–7 |
| `longueur_minimale` | int | `12` | 8–50 |
| `separateur` | string | `random` | `random`, `-`, `_`, ` `, `*`, `/`, `+` |
| `majuscule_debut` | bool | `true` | `true`, `false` |
| `majuscule_aleatoire` | bool | `false` | `true`, `false` |
| `longueur_nombre` | int | `2` | 0–5 |
| `caractere_special` | string | `random` | `random`, `none`, `$`, `!`, `#`, `?`, `-`, `+`, `@`, `,`, `;`, `:`, `*` |
| `caracteres_accentues` | bool | `true` | `true`, `false` |

### Exemple

```bash
curl "https://www.passphrase.ch/api/passwords?count=3&nb_mots=3&caractere_special=!"
```

```json
{
  "passwords": [
    { "password": "Cerise-Voyage-Brume42!" },
    { "password": "Mésange/Galet/Tonnerre18!" },
    { "password": "Vermeil_Aubépine_Sablier09!" }
  ]
}
```

L'API retourne aussi `entropy` et `class` sur la route privée `/api/passwords/preview` utilisée par le frontend.

## Structure du projet

```text
.
├── app/
│   ├── app.vue                     # Layout racine (header, footer, skip-link, manifest)
│   ├── error.vue                   # Page 404 / 500 custom
│   ├── pages/
│   │   ├── index.vue               # Landing + générateur
│   │   ├── privacy.vue             # Politique de confidentialité (nLPD + RGPD)
│   │   └── blog/[slug].vue         # Article (entropie)
│   ├── components/passphrase/      # PasswordList, EntropyBadge
│   ├── data/                       # Site config, article, info légales
│   ├── plugins/                    # Vercel Analytics + Speed Insights
│   └── assets/css/main.css         # Tailwind + tokens custom
├── server/
│   ├── api/passwords.get.ts        # API publique
│   ├── api/passwords/preview.get.ts# API frontend (avec entropy)
│   ├── middleware/cors.ts          # CORS public sur /api/passwords*
│   ├── data/db.csv                 # Dictionnaire français (~22 000 mots)
│   └── utils/dictionary.ts         # Chargement et filtrage du dictionnaire
├── shared/passphrase.ts            # Types + génération + entropy (ISO client/serveur)
├── public/                         # Icônes, manifest, sitemap, robots
└── nuxt.config.ts                  # Modules, security headers, fonts
```

## Sécurité

| Mesure | Détail |
| --- | --- |
| HSTS | `max-age=31536000; includeSubDomains; preload` |
| CSP | strict avec nonce par requête sur `script-src`, `'self'` sur tout le reste, beacons Vercel whitelistés |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera/microphone/geolocation/interest-cohort désactivés |
| CORS | `*` uniquement sur `/api/passwords*` |
| Stockage | aucun (pas de DB, pas de session, pas de log applicatif persistant) |

Les rapports CSP sont envoyés à un endpoint [csper.io](https://csper.io). Voir [`nuxt.config.ts`](./nuxt.config.ts) pour la config complète.

## Performance

Build de production audité avec Lighthouse desktop (localhost) :

| Catégorie | Score |
| --- | --- |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 96 (→ 100 sur Vercel, les beacons Analytics 404 sur localhost) |
| SEO | 100 |

Core Web Vitals : LCP &lt; 1 s · CLS 0 · TBT 0 ms.

Optimisations clés : self-hosting des polices, conversion des images en WebP, `fetchpriority="high"` sur le LCP, `@nuxt/fonts` pour preload + display-swap, CSS critical inline par Nuxt.

## Déploiement

Le projet cible **Vercel** (zero-config Nuxt). Pour déployer ton propre instance :

1. Fork ce repo
2. Importer dans Vercel (auto-détection du preset Nuxt)
3. Aucune variable d'environnement requise
4. Configurer le domaine custom (le redirect apex → www se fait côté Vercel/DNS)

Le pipeline de build télécharge les polices Google au build (via `@nuxt/fonts`) puis les self-host — aucun appel runtime vers Google Fonts.

## Contribuer

Issues et PR bienvenues. Avant d'ouvrir une PR :

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Licence et attribution

Ce projet est distribué sous **licence MIT** — voir [`LICENSE`](./LICENSE).

Il s'agit d'une **réécriture en Nuxt 4** d'un projet original en Symfony :

- **Concept original et implémentation Symfony** : [Alexandre Monchain](https://github.com/AlexandreMonchain) — [`AlexandreMonchain/Passphrase`](https://github.com/AlexandreMonchain/Passphrase)
- **Boilerplate Nuxt** : [Nuxt UI Templates](https://github.com/nuxt-ui-templates/starter)
- **Réécriture Nuxt 4, sécurité, déploiement** : [InstaZDLL](https://github.com/InstaZDLL)

Tous les copyrights sont conservés conformément aux exigences de la licence MIT.

L'extension Chrome (refonte 2.0) est disponible sur le store :
[Chrome Web Store](https://chromewebstore.google.com/detail/passphrase-%E2%80%94-g%C3%A9n%C3%A9rateur-d/fjonldepnpkjnldjhkpinojaeklmdhmp) · [Code source](./extension/)

L'extension v1 originale d'Alexandre Monchain reste disponible : [Chrome Web Store](https://chromewebstore.google.com/detail/g%C3%A9n%C3%A9rateur-de-passphrase/bhlgfoknmmhgpfoanhoemjccephcanjd) · [Code source](https://github.com/AlexandreMonchain/PassphraseChromeExtension)
