# Chrome Web Store — Métadonnées de la fiche

À copier-coller au moment de la soumission sur <https://chrome.google.com/webstore/devconsole/>.

---

## 🌍 Langue par défaut

**Français (fr)**

> Tu peux ajouter d'autres langues plus tard via "Localizations". Pour la première soumission, garde uniquement le français — c'est ton cœur de cible (extension qui génère des passphrases françaises).

---

## 📂 Catégorie

**Productivité** (Productivity)

Sous-catégorie suggérée : **Outils** (Tools)

Justification : l'extension est un outil utilitaire qui aide à créer des mots de passe — pas un thème, pas un jeu, pas une intégration sociale.

---

## 📝 Nom de l'extension

```
Passphrase — Générateur de passphrases françaises
```

(45 caractères / 75 max)

---

## 📝 Description courte (132 caractères max)

```
Génère 5 passphrases françaises mémorisables avec calcul d'entropie. Mots français, séparateurs, chiffres, caractères spéciaux.
```

(127 caractères — apparaît dans les résultats de recherche du Chrome Web Store)

---

## 📝 Description longue

À copier-coller dans le champ "Detailed description" (max 16 000 caractères, ~3 000 ici) :

```markdown
Passphrase est un générateur de mots de passe basé sur des combinaisons de mots français. Plus lisibles, plus mémorisables, et tout aussi sécurisés qu'un mot de passe aléatoire classique.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 POURQUOI UNE PASSPHRASE ?

Un mot de passe comme « xK9$mP2#vL! » est impossible à retenir, donc tu finis par le réutiliser ou le noter dans un endroit non sécurisé.

Une passphrase comme « Cerise-Voyage42$ » ou « Mésange/Crépuscule61? » atteint la même entropie cryptographique tout en restant intuitive à taper et à mémoriser.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ FONCTIONNALITÉS

✅ Génère 5 passphrases en un clic, depuis n'importe quel onglet
✅ 22 000 mots français du dictionnaire — pas de mots anglais hors contexte
✅ Calcul d'entropie en bits pour évaluer la robustesse
✅ Personnalisation complète :
   • Nombre de mots (2 à 7)
   • Séparateur (-, _, espace, *, /, +, ou aléatoire)
   • Chiffres finaux (0 à 5)
   • Caractère spécial final ($, !, #, @, etc.)
   • Longueur minimale
   • Majuscule en début de mot ou aléatoire
   • Conservation des accents (é, è, ç…)
✅ Copie en un clic vers le presse-papier
✅ Préférences mémorisées entre les sessions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 RESPECT DE LA VIE PRIVÉE

✅ Aucune donnée personnelle collectée
✅ Aucun compte requis
✅ Aucun tracking, aucune publicité
✅ Permissions minimales (storage uniquement, pour mémoriser tes choix)
✅ Le code est open source sous licence MIT

L'extension communique uniquement avec l'API publique de https://www.passphrase.ch pour générer les passphrases côté serveur. Les passphrases ne sont ni stockées ni associées à un utilisateur.

Politique de confidentialité complète : https://www.passphrase.ch/privacy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛡️ SÉCURITÉ

• Génération côté serveur via une source d'aléa cryptographique
• Communication HTTPS uniquement
• Manifest V3 — la dernière norme de sécurité Chrome
• Aucun script externe, aucun CDN tiers — tout est embarqué dans l'extension
• Code open source auditable sur GitHub

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 BONNES PRATIQUES

Les passphrases générées atteignent une entropie de 80 à 145 bits selon la configuration. Pour rappel :
• ≥ 80 bits : recommandé pour les comptes courants
• ≥ 100 bits : recommandé pour les comptes sensibles (banque, gestionnaire de mots de passe)
• ≥ 130 bits : recommandé pour les usages critiques (chiffrement disque, master password)

Stocke toujours tes passphrases dans un gestionnaire de mots de passe (Bitwarden, KeePass, 1Password, Proton Pass…) et active la double authentification (2FA) sur les services qui le permettent.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 LIENS

• Site web : https://www.passphrase.ch
• API publique : https://www.passphrase.ch/api/passwords
• Code source : https://github.com/InstaZDLL/Passphrase
• Politique de confidentialité : https://www.passphrase.ch/privacy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📜 CRÉDITS

Concept original : Alexandre Monchain (https://github.com/AlexandreMonchain/Passphrase)
Refonte UI 2.0 : InstaZDLL

Distribué sous licence MIT.
```

---

## 🎯 Single purpose (Politique du store)

```
Generate memorable French passphrases that combine random French words with separators, digits and special characters, and display their entropy in bits.
```

---

## 🔐 Privacy practices — réponses aux questions du formulaire

| Question | Réponse |
|---|---|
| **Single purpose** | Generate French passphrases (cf. ci-dessus) |
| **L'extension collecte-t-elle des données utilisateur ?** | **Non** |
| Personally identifiable information | ☐ Non coché |
| Health information | ☐ Non coché |
| Financial and payment information | ☐ Non coché |
| Authentication information | ☐ Non coché |
| Personal communications | ☐ Non coché |
| Location | ☐ Non coché |
| Web history | ☐ Non coché |
| User activity | ☐ Non coché |
| Website content | ☐ Non coché |
| **Justification d'usage des permissions** | |
| `storage` | "Stocker localement les préférences de génération de l'utilisateur (nombre de mots, séparateur, etc.) entre les sessions du popup." |
| `host_permissions: https://www.passphrase.ch/*` | "Effectuer des appels HTTP vers l'API publique passphrase.ch pour générer les passphrases côté serveur." |
| **L'extension transmet-elle des données utilisateur en dehors de l'usage principal ?** | **Non** |
| **Les données sont-elles vendues à des tiers ?** | **Non** |
| **URL de la politique de confidentialité** | `https://www.passphrase.ch/privacy` |

---

## 🏷️ Mots-clés / tags (pour la recherche interne du store)

```
passphrase, mot de passe, générateur, password, sécurité, entropie, français, security
```

---

## 📸 Captures d'écran à fournir

Minimum **1**, idéalement **3 à 5**. Format : **1280×800** ou **640×400** PNG/JPG.

Suggestions de scènes à capturer :
1. **Popup ouvert avec 5 passphrases générées** (la vue principale)
2. **Section Personnalisation dépliée** (montre les options)
3. **Animation de copie** (le bouton "Copié ✓" actif)
4. **Comparaison avant/après** : ex. mot de passe classique illisible vs passphrase mémorisable
5. **Screenshot du site web associé** (passphrase.ch en arrière-plan + extension en avant-plan)

Outil suggéré : [`screely.com`](https://screely.com) ou natif macOS/Linux pour les screenshots, ajout de bordures arrondies via Photopea/GIMP.

---

## 🖼️ Petite icône promotionnelle (optionnelle mais recommandée)

Format : **440×280 PNG** (paysage)

Tu peux réutiliser l'OG image du site (`public/og-image.png`) en la recadrant : tu as déjà tous les éléments brand-aligned.

---

## 🗒️ À cocher pendant la soumission

- [ ] Distribution → Visibility → **Public**
- [ ] Distribution → Regions → **All regions**
- [ ] Pricing → **Free**
- [ ] Privacy → Privacy practices certification → **Coché** (tu certifies que tes réponses sont exactes)

---

## ⏱️ Après "Submit for review"

Délai typique : **1 à 7 jours**. Souvent moins de 24 h pour les extensions simples sans permissions sensibles comme la tienne.

Tu reçois un email :
- **Approved** → ta fiche est live sous quelques minutes
- **Rejected** → email avec la raison (souvent une description trop vague ou un screenshot manquant). Corriges + resubmit, review beaucoup plus rapide la 2e fois.

Une fois live, m'envoyer l'URL de la fiche pour que je remplace le lien dans le footer du site et le README.
