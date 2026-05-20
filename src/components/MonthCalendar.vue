<script setup>
import IconGlyph from '@/components/IconGlyph.vue'

const props = defineProps({
  weekdayLabels: { type: Array, required: true },
  days: { type: Array, required: true },
  selectedDate: { type: String, required: true },
  today: { type: String, required: true }
})

const emit = defineEmits(['select-date'])

function handleSelect(iso) {
  emit('select-date', iso)
}

function previewTitle(day) {
  if (!day.events.length) return `${day.iso}`
  return day.events.map((event) => event.title).join(' · ')
}

function glyphForEvent(event) {
  const map = {
    power: 'bolt',
    renovation: 'hammer',
    outdoors: 'leaf',
    delivery: 'wave'
  }
  return map[event.visibilityKey] ?? 'calendar'
}
</script>

<template>
  <section class="calendar-panel">
    <div class="calendar-weekdays">
      <div v-for="day in weekdayLabels" :key="day" class="calendar-weekdays__item">{{ day }}</div>
    </div>

    <div class="calendar-grid">
      <button
        v-for="day in days"
        :key="day.iso"
        class="calendar-cell"
        :title="previewTitle(day)"
        :class="{
          'calendar-cell--outside': !day.inMonth,
          'calendar-cell--selected': day.iso === selectedDate,
          'calendar-cell--today': day.iso === today,
          'calendar-cell--busy': day.events.length
        }"
        @click="handleSelect(day.iso)"
      >
        <div class="calendar-cell__header">
          <span class="calendar-cell__day">{{ day.date.getDate() }}</span>
          <span class="calendar-cell__open-dot" :class="{ 'calendar-cell__open-dot--busy': day.events.length }" />
        </div>

        <div class="calendar-cell__tracks">
          <span
            v-for="event in day.events.slice(0, 2)"
            :key="`${day.iso}-${event.id}`"
            class="calendar-track"
            :data-status="event.status"
          >
            <IconGlyph :name="glyphForEvent(event)" />
          </span>
          <span v-if="day.events.length > 2" class="calendar-track calendar-track--more">+{{ day.events.length - 2 }}</span>
        </div>
      </button>
    </div>
  </section>
</template>
