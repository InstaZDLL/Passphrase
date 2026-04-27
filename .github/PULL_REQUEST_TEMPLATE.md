<!--
Merci pour ta contribution.
Garde la PR concentrée sur un seul sujet et utilise un titre Conventional Commits :
  type(scope): résumé court
Ex : feat(api): add passphrase length cap, fix(landing): debounce form regen, perf: lazy-load blog hero
-->

## Résumé

<!-- 1–3 phrases : qu'est-ce qui change pour l'utilisateur final ? -->

## Type de changement

<!-- Coche ce qui s'applique -->

- [ ] 🐛 Bug fix (sans cassure de comportement existant)
- [ ] ✨ Nouvelle fonctionnalité
- [ ] ⚡ Performance / accessibilité (sans changement fonctionnel)
- [ ] ♻️ Refactor interne (pas d'impact utilisateur)
- [ ] 📚 Documentation
- [ ] 🔒 Sécurité (CSP, headers, dépendances)
- [ ] 🛠️ Outillage / CI / dépendances

## Surface impactée

- [ ] Site web (`app/`, pages, composants)
- [ ] API serveur (`server/api/`)
- [ ] Extension Chrome (`extension/`)
- [ ] Configuration (`nuxt.config.ts`, `package.json`, CI)
- [ ] Documentation (`README.md`, `.github/*`)

## Vérifications

- [ ] `pnpm lint` passe
- [ ] `pnpm typecheck` passe
- [ ] `pnpm build` passe
- [ ] Test manuel en dev pour les changements visibles
- [ ] Pas de secret committé

## Captures (si UI)

<!-- Drag-and-drop d'une image avant/après -->

## Notes pour la review

<!-- Décisions de design, points à challenger, alternatives écartées… -->

## Issues liées

<!-- Closes #123 / Refs #456 -->
