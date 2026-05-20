<script setup>
import IconGlyph from '@/components/IconGlyph.vue'
import StatusBadge from '@/components/StatusBadge.vue'

const props = defineProps({
  title: { type: String, required: true },
  label: { type: String, required: true },
  days: { type: Array, required: true },
  selectedDate: { type: String, required: true },
  todayIso: { type: String, required: true },
  weekdayLong: { type: Array, required: true },
  copy: { type: Object, required: true }
})

const emit = defineEmits(['previous', 'next', 'help', 'select-date'])

function dayStatus(day) {
  return day.events[0]?.status ?? 'available'
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
        <button class="icon-button" :title="copy.previousWeek" @click="$emit('previous')"><IconGlyph name="arrowLeft" /></button>
        <button class="icon-button icon-button--help" :title="copy.showLegend" @click="$emit('help')"><IconGlyph name="question" /></button>
        <button class="icon-button" :title="copy.nextWeek" @click="$emit('next')"><IconGlyph name="arrowRight" /></button>
      </div>
    </div>

    <div class="week-strip">
      <button
        v-for="(day, index) in days"
        :key="day.iso"
        class="week-day"
        :class="{
          'week-day--selected': day.iso === selectedDate,
          'week-day--today': day.iso === todayIso
        }"
        @click="$emit('select-date', day.iso)"
      >
        <div class="week-day__name">{{ weekdayLong[index] }}</div>
        <div class="week-day__number">{{ day.date.getDate() }}</div>
        <StatusBadge :status="dayStatus(day)" :copy="copy" compact hide-text />
      </button>
    </div>
  </section>
</template>
