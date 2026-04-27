const NUMBER_OF_WORD_CHOICES = [
  { label: '2 mots', value: 2 },
  { label: '3 mots', value: 3 },
  { label: '4 mots', value: 4 },
  { label: '5 mots', value: 5 },
  { label: '6 mots', value: 6 },
  { label: '7 mots', value: 7 }
]

const SEPARATOR_CHOICES = [
  { label: 'Aléatoire', value: 'random' },
  { label: 'Tiret (-)', value: '-' },
  { label: 'Underscore (_)', value: '_' },
  { label: 'Espace', value: ' ' },
  { label: 'Étoile (*)', value: '*' },
  { label: 'Slash (/)', value: '/' },
  { label: 'Plus (+)', value: '+' }
]

const NUMBER_SUFFIX_CHOICES = [
  { label: '0 chiffre', value: 0 },
  { label: '1 chiffre', value: 1 },
  { label: '2 chiffres', value: 2 },
  { label: '3 chiffres', value: 3 },
  { label: '4 chiffres', value: 4 },
  { label: '5 chiffres', value: 5 }
]

const SPECIAL_CHARACTER_CHOICES = [
  { label: 'Aléatoire', value: 'random' },
  { label: 'Aucun', value: 'none' },
  { label: 'Dollar ($)', value: '$' },
  { label: 'Exclamation (!)', value: '!' },
  { label: 'Croisillon (#)', value: '#' },
  { label: 'Point d’interrogation (?)', value: '?' },
  { label: 'Tiret (-)', value: '-' },
  { label: 'Plus (+)', value: '+' },
  { label: 'Arobase (@)', value: '@' },
  { label: 'Virgule (,)', value: ',' },
  { label: 'Point-virgule (;)', value: ';' },
  { label: 'Deux-points (:)', value: ':' },
  { label: 'Étoile (*)', value: '*' }
]

const FORM_DEFAULTS = {
  nb_mots: 2,
  separateur: 'random',
  majuscule_debut: true,
  majuscule_aleatoire: false,
  longueur_nombre: 2,
  caractere_special: 'random',
  longueur_minimale: 12,
  caracteres_accentues: true
}

const SAMPLE_PASSWORDS = [
  { password: 'Cerise-Voyage42$', entropy: 78, class: 'very-weak' },
  { password: 'Brume_Fougère07!', entropy: 92, class: 'weak' },
  { password: 'Tonnerre*Galet18#', entropy: 104, class: 'medium' },
  { password: 'Coquelicot+Rivage33', entropy: 112, class: 'good' },
  { password: 'Mésange/Crépuscule61?', entropy: 118, class: 'good' },
  { password: 'Orage-Granit84@', entropy: 122, class: 'strong' },
  { password: 'Pissenlit Sablier 47:', entropy: 126, class: 'strong' },
  { password: 'Vermeil*Aubépine09;', entropy: 132, class: 'very-strong' },
  { password: 'Lichen+Marécage 76$', entropy: 138, class: 'very-strong' },
  { password: 'Soleil-Rocaille-Étoile-12!', entropy: 145, class: 'very-strong' }
]

const ENTROPY_LEGEND = [
  { label: 'Très faible', value: '< 80 bits', level: 'very-weak' },
  { label: 'Faible', value: '< 100 bits', level: 'weak' },
  { label: 'Moyen', value: '< 110 bits', level: 'medium' },
  { label: 'Bon', value: '< 120 bits', level: 'good' },
  { label: 'Fort', value: '< 130 bits', level: 'strong' },
  { label: 'Très fort', value: '≥ 130 bits', level: 'very-strong' }
]

const ENTROPY_LABEL = {
  'very-weak': 'Très faible',
  'weak': 'Faible',
  'medium': 'Moyen',
  'good': 'Bon',
  'strong': 'Fort',
  'very-strong': 'Très fort'
}

const API_EXAMPLE_URL = '/api/passwords?nb_mots=2&longueur_minimale=12&separateur=random&majuscule_debut=true&majuscule_aleatoire=false&longueur_nombre=2&caractere_special=random&caracteres_accentues=true&count=1'

const CURRENT_YEAR = 2026

function EntropyBadge({ entropy, level }) {
  if (entropy == null || !level) return null
  return (
    <span className="entropy-pill" data-level={level}>
      {ENTROPY_LABEL[level]} · {entropy} bits
    </span>
  )
}

function PasswordList({ items }) {
  const midpoint = Math.ceil(items.length / 2)
  const columns = [items.slice(0, midpoint), items.slice(midpoint)]

  return (
    <section
      className="passwords-panel reveal-up"
      aria-busy="false"
      aria-live="polite"
      aria-labelledby="passwords-heading"
    >
      <div className="passwords-panel__header">
        <div>
          <p className="eyebrow">Résultats</p>
          <h2 id="passwords-heading">10 variantes prêtes à copier</h2>
        </div>

        <p className="passwords-panel__hint">
          Clique pour copier, puis ajuste le motif jusqu’à obtenir l’équilibre
          qui te convient.
        </p>
      </div>

      <div className="passwords-grid">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="passwords-column">
            {column.map((item, rowIndex) => (
              <article
                key={`${columnIndex}-${rowIndex}-${item.password}`}
                className="password-row"
              >
                <div className="password-row__content">
                  <p className="password-row__value">{item.password}</p>
                  <EntropyBadge entropy={item.entropy} level={item.class} />
                </div>

                <button
                  type="button"
                  className="copy-button"
                  aria-label={`Copier ${item.password}`}
                >
                  Copier
                </button>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function SiteHeader() {
  return (
    <header className="site-header">
      <a href="/" className="site-brand">
        <span className="site-brand__mark" aria-hidden="true">P</span>
        <span>Passphrase</span>
      </a>

      <nav className="site-nav" aria-label="Navigation principale">
        <a href="/#generator">Générateur</a>
        <a href="/#api">API</a>
        <a href="/blog/entropie">Entropie</a>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Passphrase © {CURRENT_YEAR} · Génération en français, interface Nuxt
        modernisée.
      </p>
      <div className="site-footer__links">
        <a href="/api/passwords">API</a>
        <a
          href="https://github.com/AlexandreMonchain/PassphraseChromeExtension"
          target="_blank"
          rel="noreferrer noopener"
        >
          Extension
        </a>
      </div>
    </footer>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero__aurora hero__aurora--left" />
      <div className="hero__aurora hero__aurora--right" />

      <div className="hero__content reveal-up">
        <p className="eyebrow">Générateur de passphrases françaises</p>
        <h1>
          Des mots de passe plus lisibles, plus mémorisables, toujours costauds.
        </h1>
        <p className="hero__lede">
          Compose 10 passphrases en un clic, compare leur entropie et conserve
          tes préférences sans retomber dans une interface vieillissante.
        </p>

        <div className="hero__actions">
          <a href="#generator" className="primary-link">
            Générer maintenant
          </a>
          <a href="/blog/entropie" className="secondary-link">
            Comprendre l’entropie
          </a>
        </div>
      </div>
    </section>
  )
}

function GeneratorPanel() {
  return (
    <form className="generator-panel reveal-up" onSubmit={(e) => e.preventDefault()}>
      <div className="generator-panel__header">
        <div>
          <p className="eyebrow">Préférences</p>
          <h3>Personnalise ton schéma</h3>
        </div>

        <button type="button" className="ghost-button">
          Réinitialiser
        </button>
      </div>

      <div className="generator-form">
        <label className="field">
          <span>Nombre de mots</span>
          <select defaultValue={FORM_DEFAULTS.nb_mots}>
            {NUMBER_OF_WORD_CHOICES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Séparateur</span>
          <select defaultValue={FORM_DEFAULTS.separateur}>
            {SEPARATOR_CHOICES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Chiffres finaux</span>
          <select defaultValue={FORM_DEFAULTS.longueur_nombre}>
            {NUMBER_SUFFIX_CHOICES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Caractère final</span>
          <select defaultValue={FORM_DEFAULTS.caractere_special}>
            {SPECIAL_CHARACTER_CHOICES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--wide">
          <span>Longueur minimale</span>
          <input
            type="number"
            min={8}
            max={50}
            defaultValue={FORM_DEFAULTS.longueur_minimale}
          />
        </label>
      </div>

      <div className="toggle-grid">
        <label className="toggle">
          <input type="checkbox" defaultChecked={FORM_DEFAULTS.majuscule_debut} />
          <span>Majuscule en début de mot</span>
        </label>

        <label className="toggle">
          <input
            type="checkbox"
            defaultChecked={FORM_DEFAULTS.majuscule_aleatoire}
          />
          <span>Majuscule aléatoire</span>
        </label>

        <label className="toggle">
          <input
            type="checkbox"
            defaultChecked={FORM_DEFAULTS.caracteres_accentues}
          />
          <span>Conserver les accents</span>
        </label>
      </div>

      <div className="generator-panel__footer">
        <button type="submit" className="primary-button">
          Générer 10 passphrases
        </button>
      </div>
    </form>
  )
}

function Workspace() {
  return (
    <section id="generator" className="workspace">
      <div className="workspace__intro reveal-up">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>Règle le motif, puis laisse le moteur produire le reste.</h2>
        </div>

        <p className="workspace__copy">
          Les mêmes routes publiques restent disponibles, mais l’expérience
          bascule dans une interface Nuxt plus directe.
        </p>
      </div>

      <div className="workspace__grid">
        <GeneratorPanel />
        <PasswordList items={SAMPLE_PASSWORDS} />
      </div>
    </section>
  )
}

function Insights() {
  return (
    <section className="insights">
      <div className="insights__column reveal-up">
        <p className="eyebrow">Lecture rapide</p>
        <h2>Une échelle d’entropie lisible au premier regard.</h2>

        <div className="legend-list">
          {ENTROPY_LEGEND.map((item) => (
            <div key={item.level} className="legend-item">
              <span className="legend-dot" data-level={item.level} />
              <div>
                <p>{item.label}</p>
                <span>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="api" className="api-panel reveal-up">
        <p className="eyebrow">API</p>
        <h2>La route historique reste en place.</h2>
        <p>
          {'`GET /api/passwords`'} conserve les paramètres publics existants
          pour ne pas casser les intégrations déjà en circulation.
        </p>

        <pre className="api-snippet">{API_EXAMPLE_URL}</pre>

        <div className="api-panel__actions">
          <button type="button" className="ghost-button">
            Copier l’exemple
          </button>

          <a
            className="secondary-link"
            href={API_EXAMPLE_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            Tester l’API
          </a>
        </div>
      </div>
    </section>
  )
}

function ExtensionStrip() {
  return (
    <section className="extension-strip reveal-up">
      <div>
        <p className="eyebrow">Extension Chrome</p>
        <h2>Besoin d’aller plus vite dans le navigateur ?</h2>
        <p>
          L’extension reste disponible pour générer une passphrase sans quitter
          ton contexte de navigation.
        </p>
      </div>

      <a
        href="https://chromewebstore.google.com/detail/g%C3%A9n%C3%A9rateur-de-passphrase/bhlgfoknmmhgpfoanhoemjccephcanjd"
        target="_blank"
        rel="noreferrer noopener"
        className="primary-link"
      >
        Installer l’extension
      </a>
    </section>
  )
}

function LandingPage() {
  return (
    <div className="app-shell">
      <SiteHeader />

      <main className="home-page">
        <Hero />
        <Workspace />
        <Insights />
        <ExtensionStrip />
      </main>

      <SiteFooter />
    </div>
  )
}
