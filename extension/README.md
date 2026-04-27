# Passphrase — Chrome Extension

Extension Chrome compagnon de [Passphrase](https://www.passphrase.ch). Génère 5 passphrases françaises depuis un popup, sans quitter ton onglet courant.

## Installation locale (mode développeur)

1. Ouvre `chrome://extensions/`
2. Active **Mode développeur** (coin haut droit)
3. Clique **Charger l'extension non empaquetée**
4. Sélectionne le dossier `extension/` de ce dépôt

L'icône Passphrase apparaît dans la barre d'extensions.

## Architecture

| Fichier | Rôle |
| --- | --- |
| `manifest.json` | Manifest V3 (permissions `storage` uniquement, host `https://www.passphrase.ch/*`) |
| `popup.html` | Markup du popup (360 px de large) |
| `popup.css` | Styles brand-aligned (palette du site, dark results panel, light shell) |
| `popup.js` | Logique : restore settings → fetch API → render → copy → autosave |
| `icons/icon-{16,48,128}.png` | Icônes (générées depuis le SVG du logo principal) |

## API

L'extension consomme l'API publique `GET https://www.passphrase.ch/api/passwords` avec les paramètres standard du projet. Les préférences utilisateur sont stockées dans `chrome.storage.local` et restaurées à chaque ouverture du popup.

## Sécurité

- Manifest V3 avec CSP par défaut (`script-src 'self'`)
- Aucun script ni stylesheet externe (Font Awesome retiré, icônes inline en SVG)
- Aucun `innerHTML` avec contenu dynamique → pas de surface XSS
- Permissions minimales : `storage` (préférences locales) + `host_permissions` limité à `passphrase.ch`

## Publication sur le Chrome Web Store

```bash
# Depuis la racine du repo
cd extension
zip -r ../passphrase-extension-2.0.0.zip . -x ".*"
```

Upload le zip sur le [Developer Dashboard](https://chrome.google.com/webstore/devconsole/) en tant que mise à jour ou nouvel item.

## Crédits

- **Concept et version 1.0** : [Alexandre Monchain](https://github.com/AlexandreMonchain) — [`AlexandreMonchain/PassphraseChromeExtension`](https://github.com/AlexandreMonchain/PassphraseChromeExtension)
- **Refonte UI 2.0** : [InstaZDLL](https://github.com/InstaZDLL)

Distribué sous [licence MIT](../LICENSE).
