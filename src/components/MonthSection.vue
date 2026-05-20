<script setup>
import IconGlyph from '@/components/IconGlyph.vue'

const props = defineProps({
  title: { type: String, required: true },
  label: { type: String, required: true },
  weekdayLabels: { type: Array, required: true },
  days: { type: Array, required: true },
  selectedDate: { type: String, required: true },
  todayIso: { type: String, required: true },
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
        <button class="icon-button" :title="copy.previousMonth" @click="$emit('previous')"><IconGlyph name="arrowLeft" /></button>
        <button class="icon-button icon-button--help" :title="copy.showLegend" @click="$emit('help')"><IconGlyph name="question" /></button>
        <button class="icon-button" :title="copy.nextMonth" @click="$emit('next')"><IconGlyph name="arrowRight" /></button>
      </div>
    </div>

    <div class="month-weekdays">
      <div v-for="label in weekdayLabels" :key="label" class="month-weekdays__item">{{ label }}</div>
    </div>

    <div class="month-grid">
      <button
        v-for="day in days"
        :key="day.iso"
        class="month-cell"
        :class="{
          'month-cell--outside': !day.inMonth,
          'month-cell--selected': day.iso === selectedDate,
          'month-cell--today': day.iso === todayIso
        }"
        @click="$emit('select-date', day.iso)"
      >
        <span class="month-cell__number">{{ day.date.getDate() }}</span>
        <span class="month-cell__status" :data-status="dayStatus(day)" />
      </button>
    </div>
  </section>
</template>
