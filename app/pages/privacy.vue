<script setup lang="ts">
import { absoluteUrl, defaultOgImage, siteName } from '../data/site'
import { formatLastUpdated, legalInfo } from '../data/legal'

const title = 'Politique de confidentialité'
const description = `Données traitées, finalités, sous-traitants et droits — pour ${siteName}.`
const canonicalUrl = absoluteUrl('/privacy')

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})

useSeoMeta({
  title,
  description,
  ogUrl: canonicalUrl,
  ogTitle: title,
  ogDescription: description,
  ogType: 'article',
  ogImage: absoluteUrl(defaultOgImage),
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: absoluteUrl(defaultOgImage),
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <main
    id="main-content"
    class="legal-page"
  >
    <article class="legal-page__inner reveal-up">
      <header class="legal-page__header">
        <p class="eyebrow">
          Compliance
        </p>
        <h1>Politique de confidentialité</h1>
        <p class="legal-page__updated">
          Dernière mise à jour : {{ formatLastUpdated() }}
        </p>
      </header>

      <section class="legal-section">
        <h2>1. Responsable du traitement</h2>
        <p>
          Le service <strong>{{ siteName }}</strong> (accessible sur
          <a href="https://www.passphrase.ch">https://www.passphrase.ch</a>) est un projet personnel et non commercial.
          Le responsable du traitement au sens de l’art. 5 let. j nLPD et de l’art. 4 §7 RGPD est joignable à l’adresse
          email indiquée ci-dessous, qui est le canal officiel pour toute demande relative à tes données.
        </p>
        <ul>
          <li><strong>Contact :</strong> <a :href="`mailto:${legalInfo.contactEmail}`">{{ legalInfo.contactEmail }}</a></li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>2. Données collectées</h2>

        <h3>2.1 Génération de passphrases</h3>
        <p>
          Les passphrases sont générées à la volée par le serveur à partir d’un dictionnaire français statique embarqué
          dans le code source. <strong>Aucune passphrase générée n’est stockée</strong> côté serveur, ni associée à un
          utilisateur. La requête est traitée puis oubliée immédiatement.
        </p>

        <h3>2.2 Préférences locales (cookie)</h3>
        <p>
          Un cookie technique nommé <code>user_preferences</code> est posé sur ton navigateur pour mémoriser tes choix
          de génération (nombre de mots, séparateur, etc.) entre tes visites. Il est strictement local, conservé 30 jours
          au maximum, et ne contient aucune donnée personnelle identifiable.
        </p>

        <h3>2.3 Données techniques (logs serveur)</h3>
        <p>
          L’hébergeur Vercel collecte automatiquement, pour la sécurité et la prévention d’abus :
        </p>
        <ul>
          <li><strong>Adresse IP</strong></li>
          <li><strong>En-têtes HTTP</strong> (User-Agent, Accept-Language, Referer)</li>
          <li><strong>Horodatage de la requête</strong></li>
        </ul>
        <p>
          Ces données sont conservées de manière limitée par Vercel selon sa propre politique
          (<a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >privacy policy Vercel</a>).
        </p>

        <h3>2.4 Analytics</h3>
        <p>
          Nous utilisons <strong>Vercel Web Analytics</strong> et <strong>Vercel Speed Insights</strong> pour mesurer
          la fréquentation et les performances techniques (Core Web Vitals). Ces outils fonctionnent
          <strong>sans cookies</strong>, sans identifiant persistant, et ne permettent pas de reconstituer un parcours
          utilisateur individuel. Ils agrègent des compteurs anonymes côté serveur Vercel.
        </p>

        <h3>2.5 Données non collectées</h3>
        <p>
          Pas de compte utilisateur, pas d’email, pas de mot de passe, pas de tracking publicitaire, pas de fingerprinting,
          pas de cookies tiers, pas de profilage comportemental.
        </p>
      </section>

      <section class="legal-section">
        <h2>3. Cookies</h2>
        <p>
          Un seul cookie est posé : <code>user_preferences</code>, fonctionnel et nécessaire à la mémorisation de tes
          choix de formulaire. Il est considéré comme strictement nécessaire au sens de la directive ePrivacy et ne
          requiert pas de consentement préalable selon les
          <a
            href="https://www.edoeb.admin.ch/edoeb/fr/home/protection-des-donnees/Internet_und_Computer/cookies.html"
            target="_blank"
            rel="noopener noreferrer"
          >directives du PFPDT</a>.
          Vercel Analytics et Speed Insights sont cookieless.
        </p>
      </section>

      <section class="legal-section">
        <h2>4. Finalités et bases juridiques</h2>
        <table class="legal-table">
          <thead>
            <tr>
              <th>Traitement</th>
              <th>Finalité</th>
              <th>Base légale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Génération de passphrases</td>
              <td>Fourniture du service</td>
              <td>Mesures précontractuelles (art. 31 al. 1 nLPD, art. 6.1.b RGPD)</td>
            </tr>
            <tr>
              <td>Cookie <code>user_preferences</code></td>
              <td>Mémorisation des choix utilisateur</td>
              <td>Intérêt légitime (art. 31 al. 2 nLPD, art. 6.1.f RGPD)</td>
            </tr>
            <tr>
              <td>Logs serveur (IP, UA)</td>
              <td>Sécurité, prévention des abus</td>
              <td>Intérêt légitime (art. 31 al. 2 nLPD, art. 6.1.f RGPD)</td>
            </tr>
            <tr>
              <td>Analytics agrégés</td>
              <td>Mesure de fréquentation, performance</td>
              <td>Intérêt légitime (art. 6.1.f RGPD)</td>
            </tr>
          </tbody>
        </table>
        <p>
          Aucune décision automatisée produisant des effets juridiques n’est prise à ton égard.
        </p>
      </section>

      <section class="legal-section">
        <h2>5. Destinataires et transferts</h2>

        <h3>5.1 Hébergement : Vercel Inc. (USA)</h3>
        <p>
          L’application est hébergée par Vercel Inc. aux États-Unis. Les transferts vers les USA sont couverts par les
          <strong>Clauses Contractuelles Types</strong> de la Commission européenne et par l’adhésion de Vercel au
          <strong>Data Privacy Framework</strong> UE-USA, reconnu adéquat par la Suisse.
        </p>

        <h3>5.2 Polices de caractères</h3>
        <p>
          Les polices Manrope et Fraunces sont <strong>self-hostées</strong> via <code>@nuxt/fonts</code>. Aucune
          requête vers un CDN tiers (Google Fonts ou autre) n’a lieu au runtime — aucune donnée n’est transmise à ce
          titre.
        </p>
      </section>

      <section class="legal-section">
        <h2>6. Durée de conservation</h2>
        <table class="legal-table">
          <thead>
            <tr>
              <th>Données</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Passphrases générées</td>
              <td>Aucune (pas de stockage)</td>
            </tr>
            <tr>
              <td>Cookie <code>user_preferences</code></td>
              <td>30 jours côté navigateur</td>
            </tr>
            <tr>
              <td>Logs serveur (IP, UA)</td>
              <td>Selon la politique Vercel (généralement &lt; 30 jours)</td>
            </tr>
            <tr>
              <td>Analytics agrégés</td>
              <td>Selon la rétention Vercel (max 12 mois)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="legal-section">
        <h2>7. Tes droits (nLPD / RGPD)</h2>
        <ul>
          <li><strong>Accès</strong> : obtenir une copie des données te concernant</li>
          <li><strong>Rectification</strong> : corriger une inexactitude</li>
          <li><strong>Effacement</strong> : demander la suppression</li>
          <li><strong>Portabilité</strong> : recevoir tes données dans un format structuré</li>
          <li><strong>Opposition</strong> : t’opposer à un traitement basé sur l’intérêt légitime</li>
          <li><strong>Limitation</strong> : demander la limitation du traitement</li>
        </ul>
        <p>
          Exerce tes droits par email à <a :href="`mailto:${legalInfo.contactEmail}`">{{ legalInfo.contactEmail }}</a>
          (réponse sous 30 jours). En cas de désaccord :
        </p>
        <ul>
          <li>
            Suisse : Préposé fédéral à la protection des données et à la transparence (PFPDT) — <a
              href="https://www.edoeb.admin.ch"
              target="_blank"
              rel="noopener noreferrer"
            >edoeb.admin.ch</a>
          </li>
          <li>UE : autorité de contrôle de ton pays de résidence</li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>8. Sécurité</h2>
        <p>Mesures techniques et organisationnelles conformes à l’art. 8 nLPD et à l’art. 32 RGPD :</p>
        <ul>
          <li><strong>Chiffrement en transit</strong> : HTTPS/TLS partout, HSTS preload (1 an, includeSubDomains)</li>
          <li><strong>Content Security Policy</strong> stricte avec nonce par requête</li>
          <li><strong>Headers sécurisés</strong> : X-Content-Type-Options, X-Frame-Options, Referrer-Policy strict, Permissions-Policy restrictive</li>
          <li><strong>Pas de surface d’attaque liée au stockage</strong> : aucune base de données, aucun secret, aucune session</li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>9. Mineurs</h2>
        <p>
          Le service est accessible à tous mais n’est pas spécifiquement destiné aux personnes de moins de 16 ans.
          Aucune donnée n’est collectée sciemment auprès de mineurs.
        </p>
      </section>

      <section class="legal-section">
        <h2>10. Modifications</h2>
        <p>
          Cette politique peut être mise à jour. La date de dernière mise à jour figure en haut de page. Les changements
          substantiels seront signalés sur la page d’accueil.
        </p>
      </section>

      <section class="legal-section">
        <h2>11. Contact</h2>
        <p>
          Pour toute question, demande d’accès ou plainte : <a :href="`mailto:${legalInfo.contactEmail}`">{{ legalInfo.contactEmail }}</a>
        </p>
      </section>
    </article>
  </main>
</template>
