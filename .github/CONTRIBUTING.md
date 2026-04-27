# Contribuer à Passphrase

Merci de l'intérêt que tu portes à ce projet. Ce guide récapitule comment proposer une contribution propre et facilement relectible.

En participant, tu acceptes notre [Code of Conduct](./CODE_OF_CONDUCT.md).

## Préparer l'environnement

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

### Lancer le projet

```bash
pnpm dev          # serveur Nuxt sur :3000 (CSP/HSTS désactivés en dev)
pnpm build        # build production
pnpm start        # preview du build production
```

## Règles du dépôt

- Utiliser **pnpm** (le `pnpm-lock.yaml` est la source de vérité — ne pas committer un `package-lock.json` ou `yarn.lock`).
- Ne pas éditer manuellement les fichiers sous `.output/`, `.nuxt/`, `node_modules/`.
- Garder chaque pull request concentrée sur un seul sujet.
- Ne jamais committer de secrets (`.env`, clés, tokens). Le projet ne devrait pas en avoir.

## Vérifications avant pull request

Exécute au minimum :

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Si tu modifies `app/components/passphrase/`, `app/pages/index.vue` ou la logique de génération, lance également un test manuel en navigateur pour vérifier l'absence de régression visuelle (le formulaire, la copie, la mémorisation des préférences).

Si tu touches à `nuxt.config.ts` (security headers, CSP, fonts), audite avec Lighthouse en mode prod (`pnpm build && pnpm start`) avant de soumettre la PR.

## Style de contribution

- **TypeScript** côté app, **JavaScript** vanilla pour l'extension Chrome.
- Indentation 2 espaces, single quotes en TS/Vue, double quotes uniquement quand l'attribut JSX/template l'impose.
- `<script setup lang="ts">` pour les composants Vue.
- Préférer la composition API et les composables Nuxt (`useFetch`, `useState`, etc.) plutôt que des helpers maison.
- Nommer les fichiers Vue en `PascalCase` (composants) ou `kebab-case` (pages).
- Ajouter des commentaires uniquement quand le code n'est pas évident à lire (le « pourquoi », pas le « quoi »).

## Pull requests

Ta pull request devrait contenir :

- un titre clair en Conventional Commits (voir ci-dessous) ;
- un résumé de l'impact utilisateur ;
- les commandes de vérification exécutées ;
- une capture d'écran pour les changements visuels.

Le template de PR (`.github/pull_request_template.md`) sera pré-rempli automatiquement.

## Conventional Commits

Les messages de commit suivent le style [Conventional Commits](https://www.conventionalcommits.org/) :

```text
type(scope): résumé court
```

Types couramment utilisés :

| Type | Quand l'utiliser |
| --- | --- |
| `feat` | Nouvelle fonctionnalité utilisateur |
| `fix` | Correctif de bug |
| `perf` | Amélioration de performance sans changement fonctionnel |
| `refactor` | Réorganisation interne sans changement de comportement |
| `docs` | Documentation, README, commentaires |
| `chore` | Outillage, dépendances, CI |
| `style` | Formatage, indentation (pas du CSS) |
| `test` | Ajout ou modification de tests |

Exemples valides :

- `feat(api): expose /api/passwords/preview entropy class`
- `fix(landing): prevent password copy on Safari iOS`
- `perf: convert hero PNG to WebP for LCP`
- `chore(deps): bump @nuxt/ui to 4.7`

## Sécurité

Pour une faille de sécurité, **ne crée pas d'issue publique**. Suis la procédure dans [SECURITY.md](./SECURITY.md).

## Licence

Ce projet est sous licence MIT. En contribuant, tu acceptes que tes contributions soient distribuées sous la même licence. Les copyright holders existants (Alexandre Monchain pour le concept original, Nuxt UI Templates pour le boilerplate, InstaZDLL pour la fork) sont préservés conformément aux exigences MIT.

Pas de CLA à signer — la licence MIT est suffisante.
