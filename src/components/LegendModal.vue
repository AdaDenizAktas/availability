<script setup>
import IconGlyph from '@/components/IconGlyph.vue'
import StatusBadge from '@/components/StatusBadge.vue'

defineProps({
  open: { type: Boolean, required: true },
  copy: { type: Object, required: true }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="open" class="overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-card__header">
        <div>
          <div class="section-card__title">{{ copy.legendTitle }}</div>
          <div class="section-card__label">{{ copy.legendIntro }}</div>
        </div>
        <button class="icon-button" :title="copy.close" @click="$emit('close')"><IconGlyph name="close" /></button>
      </div>

      <div class="legend-stack">
        <div class="legend-row"><StatusBadge status="available" :copy="copy" compact /><span>{{ copy.legendItems.available }}</span></div>
        <div class="legend-row"><StatusBadge status="limited" :copy="copy" compact /><span>{{ copy.legendItems.limited }}</span></div>
        <div class="legend-row"><StatusBadge status="unavailable" :copy="copy" compact /><span>{{ copy.legendItems.unavailable }}</span></div>
        <div class="legend-row"><span class="legend-chip legend-chip--selected" /><span>{{ copy.legendItems.selected }}</span></div>
        <div class="legend-row"><span class="legend-chip legend-chip--today" /><span>{{ copy.legendItems.today }}</span></div>
        <div class="legend-row"><span class="legend-chip legend-chip--event" /><span>{{ copy.legendItems.event }}</span></div>
      </div>
    </div>
  </div>
</template>
