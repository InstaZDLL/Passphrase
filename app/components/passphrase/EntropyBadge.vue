<script setup lang="ts">
import type { EntropyLevel } from '#shared/passphrase'

const props = defineProps<{
  entropy?: number
  level?: EntropyLevel
}>()

const labelByLevel: Record<EntropyLevel, string> = {
  'very-weak': 'Très faible',
  'weak': 'Faible',
  'medium': 'Moyen',
  'good': 'Bon',
  'strong': 'Fort',
  'very-strong': 'Très fort'
}

const label = computed(() => {
  if (!props.level || props.entropy == null) {
    return ''
  }

  return `${labelByLevel[props.level]} · ${props.entropy} bits`
})
</script>

<template>
  <span
    v-if="label"
    class="entropy-pill"
    :data-level="level"
  >
    {{ label }}
  </span>
</template>
