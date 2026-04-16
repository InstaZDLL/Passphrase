<script setup lang="ts">
import type { GeneratedPassword } from '#shared/passphrase'

const props = defineProps<{
  items: GeneratedPassword[]
  pending?: boolean
  revision?: number
}>()

const copiedPassword = ref<string | null>(null)

async function copyPassword(password: string) {
  try {
    await navigator.clipboard.writeText(password)
    copiedPassword.value = password

    window.setTimeout(() => {
      if (copiedPassword.value === password) {
        copiedPassword.value = null
      }
    }, 1600)
  } catch {
    copiedPassword.value = null
  }
}

const columns = computed(() => {
  const midpoint = Math.ceil(props.items.length / 2)
  return [props.items.slice(0, midpoint), props.items.slice(midpoint)]
})
</script>

<template>
  <section
    class="passwords-panel reveal-up"
    :class="{ 'passwords-panel--pending': pending }"
    :aria-busy="pending ? 'true' : 'false'"
    aria-live="polite"
    aria-labelledby="passwords-heading"
  >
    <div class="passwords-panel__header">
      <div>
        <p class="eyebrow">
          Résultats
        </p>
        <h2 id="passwords-heading">
          10 variantes prêtes à copier
        </h2>
      </div>

      <p class="passwords-panel__hint">
        Clique pour copier, puis ajuste le motif jusqu’à obtenir l’équilibre qui te convient.
      </p>
    </div>

    <div
      class="passwords-grid"
    >
      <TransitionGroup
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        class="passwords-column"
        tag="div"
      >
        <article
          v-for="(item, rowIndex) in column"
          :key="`${revision ?? 0}-${columnIndex}-${rowIndex}-${item.password}`"
          class="password-row"
        >
          <div class="password-row__content">
            <p class="password-row__value">
              {{ item.password }}
            </p>
            <PassphraseEntropyBadge
              :entropy="item.entropy"
              :level="item.class"
            />
          </div>

          <button
            type="button"
            class="copy-button"
            :aria-label="`Copier ${item.password}`"
            @click="copyPassword(item.password)"
          >
            {{ copiedPassword === item.password ? 'Copié' : 'Copier' }}
          </button>
        </article>
      </TransitionGroup>
    </div>

    <Transition name="passwords-overlay">
      <div
        v-if="pending"
        class="passwords-loading"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span class="passwords-loading__dot" />
        <span>Génération en cours…</span>
      </div>
    </Transition>
  </section>
</template>
