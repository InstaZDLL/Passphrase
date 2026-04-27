# Politique de sécurité

Passphrase est un générateur de mots de passe — la sécurité du code est une priorité absolue. Si tu découvres une vulnérabilité, merci de la signaler de manière responsable avant toute divulgation publique.

## Versions supportées

Le projet n'a pas de versioning long terme. La branche `main` (et donc le déploiement en production sur `https://www.passphrase.ch`) est la seule version supportée pour les correctifs de sécurité.

| Version | Support |
| --- | --- |
| `main` / déploiement actuel | Oui |
| Forks non maintenus | Non |
| Versions Symfony d'origine (Alexandre Monchain) | Voir le repo upstream |

## Signaler une vulnérabilité

**Ne publie pas une faille de sécurité dans une issue publique.**

Utilise l'un de ces canaux, par ordre de préférence :

1. **GitHub Security Advisories** — onglet *Security* du dépôt → *Report a vulnerability*. Canal confidentiel et chiffré, recommandé.
2. **Email** : <contact@southlabs.fr> avec `[Passphrase Security]` en objet. Si tu veux chiffrer, demande la clé PGP par retour.

Réponse initiale sous **7 jours ouvrés**.

Le rapport devrait inclure :

- Une description claire du problème
- L'impact attendu (XSS, CSRF, fuite de données, contournement CSP, faiblesse cryptographique du générateur, etc.)
- Les chemins / endpoints / paramètres concernés
- Des étapes de reproduction (URL de test, payload, commande `curl`)
- Une proposition de mitigation si tu en as une
- Tes informations de contact pour le suivi (et si tu souhaites être crédité après publication du fix)

## Délais cibles

- **Accusé de réception** : sous 3 jours ouvrés
- **Première évaluation** (sévérité, faisabilité du fix) : sous 7 jours ouvrés
- **Mises à jour de suivi** : au moins une fois par semaine jusqu'au correctif déployé
- **Disclosure publique** : coordonnée avec toi, généralement 30 à 90 jours après le fix selon la gravité

## Périmètre

### Dans le périmètre

Les surfaces sensibles principales :

- **Génération des passphrases** : qualité de la source d'aléa, biais éventuel, prédictibilité
- **API publique** `/api/passwords*` : injections, contournement de validation, abus du CORS ouvert
- **Headers de sécurité** : contournement de CSP, downgrade HSTS, fuite via Referer
- **Cookie `user_preferences`** : XSS via le formulaire, fixation, désérialisation
- **Dépendances tierces** : faille critique dans Nuxt, Vue, Nuxt UI, nuxt-security ou les packages Vercel
- **Configuration de déploiement** : exposition d'env vars, headers Vercel mal configurés

### Hors périmètre

- Faiblesse théorique d'une passphrase qu'un utilisateur aurait choisi de manière non-aléatoire
- Réutilisation d'une passphrase par l'utilisateur sur plusieurs sites
- Attaques par force brute distribuées contre une passphrase générée avec une entropie correcte (≥ 80 bits) — c'est la responsabilité du service cible (rate-limit, hashing, MFA)
- Bugs cosmétiques ou problèmes d'ergonomie sans impact sécurité
- Vulnérabilités dans des plateformes tierces utilisées sans modification (Vercel, GitHub, navigateurs)
- Reports automatisés génériques sans démonstration d'exploitabilité (CSP missing X, header Y manquant) — utilise une issue publique pour ce genre de feedback

## Récompenses

Le projet n'offre pas de bug bounty monétaire — c'est un outil gratuit non-commercial. Cependant, les chercheurs qui signalent une vulnérabilité valide et qui le souhaitent seront crédités dans les *release notes* du fix et dans une éventuelle section *Acknowledgments* du README.

Merci pour ton aide à rendre Passphrase plus sûr.
