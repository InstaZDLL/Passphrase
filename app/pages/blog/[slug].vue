<script setup lang="ts">
import { absoluteUrl } from '../../data/site'
import { entropyArticle } from '../../data/entropy-article'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))

if (slug.value !== 'entropie') {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article introuvable'
  })
}

const canonicalUrl = absoluteUrl(`/blog/${slug.value}`)
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  'headline': entropyArticle.title,
  'description': entropyArticle.description,
  'image': [absoluteUrl(entropyArticle.heroImage)],
  'author': {
    '@type': 'Person',
    'name': entropyArticle.author
  },
  'publisher': {
    '@type': 'Organization',
    'name': 'Passphrase'
  },
  'datePublished': entropyArticle.publishedAt,
  'dateModified': entropyArticle.publishedAt,
  'mainEntityOfPage': canonicalUrl,
  'inLanguage': 'fr'
}

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ],
  script: [
    {
      id: 'passphrase-entropy-article-schema',
      type: 'application/ld+json',
      textContent: JSON.stringify(articleSchema)
    }
  ]
})

useSeoMeta({
  title: entropyArticle.title,
  description: entropyArticle.description,
  ogUrl: canonicalUrl,
  ogTitle: entropyArticle.title,
  ogDescription: entropyArticle.description,
  ogType: 'article',
  ogImage: absoluteUrl(entropyArticle.heroImage),
  articlePublishedTime: entropyArticle.publishedAt,
  articleModifiedTime: entropyArticle.publishedAt,
  articleAuthor: [entropyArticle.author],
  twitterTitle: entropyArticle.title,
  twitterDescription: entropyArticle.description,
  twitterImage: absoluteUrl(entropyArticle.heroImage),
  twitterCard: 'summary_large_image'
})

const formattedDate = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'long'
}).format(new Date(entropyArticle.publishedAt))
</script>

<template>
  <main
    id="main-content"
    class="article-page"
  >
    <section class="article-hero reveal-up">
      <div>
        <p class="eyebrow">
          Article
        </p>
        <h1>{{ entropyArticle.title }}</h1>
        <p class="article-hero__lede">
          {{ entropyArticle.description }}
        </p>

        <div class="article-meta">
          <span>{{ entropyArticle.author }}</span>
          <span>{{ formattedDate }}</span>
        </div>
      </div>

      <img
        :src="entropyArticle.heroImage"
        alt="Illustration autour de l’entropie des mots de passe"
        class="article-hero__image"
        width="1792"
        height="1024"
        decoding="async"
        fetchpriority="high"
      >
    </section>

    <section class="article-grid">
      <article class="article-body reveal-up">
        <div class="formula-block">
          <p class="eyebrow">
            Formule
          </p>
          <h2>{{ entropyArticle.formula }}</h2>
        </div>

        <section
          v-for="section in entropyArticle.sections"
          :key="section.title"
          class="article-section"
        >
          <h2>{{ section.title }}</h2>
          <p
            v-for="paragraph in section.paragraphs"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </section>
      </article>

      <aside class="article-sidebar reveal-up">
        <section class="example-panel">
          <p class="eyebrow">
            Exemples
          </p>

          <div
            v-for="example in entropyArticle.examples"
            :key="example.password"
            class="example-card"
          >
            <h3>{{ example.label }}</h3>
            <p class="example-card__password">
              {{ example.password }}
            </p>
            <ul>
              <li
                v-for="note in example.notes"
                :key="note"
              >
                {{ note }}
              </li>
            </ul>
          </div>
        </section>
      </aside>
    </section>

    <section class="recommendations reveal-up">
      <div class="recommendations__column">
        <p class="eyebrow">
          Entreprises
        </p>
        <h2>Gestionnaires à évaluer côté équipe.</h2>

        <div class="recommendation-list">
          <article
            v-for="item in entropyArticle.recommendations.companies"
            :key="item.name"
            class="recommendation-item"
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </div>

      <div class="recommendations__column">
        <p class="eyebrow">
          Particuliers
        </p>
        <h2>Des outils plus simples pour un usage quotidien.</h2>

        <div class="recommendation-list">
          <article
            v-for="item in entropyArticle.recommendations.individuals"
            :key="item.name"
            class="recommendation-item"
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
