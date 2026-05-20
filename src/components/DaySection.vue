<script setup>
import IconGlyph from '@/components/IconGlyph.vue'
import StatusBadge from '@/components/StatusBadge.vue'

defineProps({
  title: { type: String, required: true },
  label: { type: String, required: true },
  dateIso: { type: String, required: true },
  events: { type: Array, required: true },
  copy: { type: Object, required: true }
})

const emit = defineEmits(['previous', 'next', 'help', 'select-date'])

function hourStatus(events) {
  return events[0]?.status ?? 'available'
}
</script>

<template>
  <section class="section-card">
    <div class="section-card__header">
      <div>
        <div class="section-card__title">{{ title }}</div>
        <div class="section-card__label">{{ label }}</div>
      </div>
      <div class="section-card__controls">
        <button class="icon-button" :title="copy.previousDay" @click="$emit('previous')"><IconGlyph name="arrowLeft" /></button>
        <button class="icon-button icon-button--help" :title="copy.showLegend" @click="$emit('help')"><IconGlyph name="question" /></button>
        <button class="icon-button" :title="copy.nextDay" @click="$emit('next')"><IconGlyph name="arrowRight" /></button>
      </div>
    </div>

    <button class="day-timeline" @click="$emit('select-date', dateIso)">
      <div class="day-timeline__status">
        <StatusBadge :status="hourStatus(events)" :copy="copy" compact />
      </div>
      <div class="day-timeline__grid">
        <div v-for="hour in 24" :key="hour" class="day-hour" :data-status="hourStatus(events)">
          <span class="day-hour__label">{{ String(hour - 1).padStart(2, '0') }}</span>
        </div>
      </div>
    </button>
  </section>
</template>
