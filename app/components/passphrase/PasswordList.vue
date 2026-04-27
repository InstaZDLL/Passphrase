<script setup lang="ts">
import type { GeneratedPassword } from '#shared/passphrase'

defineProps<{
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
</script>

<template>
  <section
    class="reveal-up relative overflow-hidden rounded-[2rem] bg-gray-900 text-white p-6 md:p-8 shadow-2xl"
    :aria-busy="pending ? 'true' : 'false'"
    aria-live="polite"
    aria-labelledby="passwords-heading"
  >
    <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

    <div class="relative z-10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-primary-400 font-extrabold uppercase tracking-[0.18em] text-xs mb-2">
          Résultats
        </p>
        <h2
          id="passwords-heading"
          class="font-display text-3xl leading-tight"
        >
          10 variantes prêtes à copier
        </h2>
      </div>
      <p class="text-gray-400 text-sm max-w-xs">
        Clique pour copier, puis ajuste le motif jusqu’à obtenir l’équilibre qui te convient.
      </p>
    </div>

    <div
      class="relative z-10 transition-all duration-300"
      :class="pending ? 'opacity-50 scale-[0.99]' : 'opacity-100'"
    >
      <TransitionGroup
        name="passwords-column"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
      >
        <article
          v-for="(item, index) in items"
          :key="`${revision ?? 0}-${index}-${item.password}`"
          class="flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all"
        >
          <div class="mb-5">
            <p class="font-display text-xl sm:text-2xl text-white mb-3 break-all leading-tight">
              {{ item.password }}
            </p>
            <PassphraseEntropyBadge
              :entropy="item.entropy"
              :level="item.class"
            />
          </div>

          <button
            type="button"
            class="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors"
            :aria-label="`Copier ${item.password}`"
            @click="copyPassword(item.password)"
          >
            {{ copiedPassword === item.password ? 'Copié ✓' : 'Copier' }}
          </button>
        </article>
      </TransitionGroup>
    </div>

    <Transition name="passwords-overlay">
      <div
        v-if="pending"
        class="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-gray-900/40 backdrop-blur-sm text-gray-200 pointer-events-none"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span class="w-3 h-3 rounded-full bg-primary-500 animate-pulse" />
        <span>Génération en cours…</span>
      </div>
    </Transition>
  </section>
</template>
