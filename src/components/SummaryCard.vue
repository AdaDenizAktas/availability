<script setup>
import IconGlyph from '@/components/IconGlyph.vue'

defineProps({
  icon: { type: String, required: true },
  value: { type: String, required: true },
  hint: { type: String, default: '' },
  tone: { type: String, default: 'neutral' }
})
</script>

<template>
  <article class="summary-card" :data-tone="tone">
    <div class="summary-card__top">
      <span class="summary-card__icon-wrap">
        <IconGlyph :name="icon" />
      </span>
      <div class="summary-card__value">{{ value }}</div>
    </div>
    <div v-if="hint" class="summary-card__hint">{{ hint }}</div>
  </article>
</template>
