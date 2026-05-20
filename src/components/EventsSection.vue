<script setup>
import IconGlyph from '@/components/IconGlyph.vue'
import StatusBadge from '@/components/StatusBadge.vue'

defineProps({
  title: { type: String, required: true },
  entries: { type: Array, required: true },
  copy: { type: Object, required: true },
  formatRange: { type: Function, required: true }
})

const emit = defineEmits(['open-all', 'select-date'])
</script>

<template>
  <section class="section-card section-card--list">
    <div class="section-card__header">
      <div>
        <div class="section-card__title">{{ title }}</div>
        <div class="section-card__label">{{ copy.untilOneYear }}</div>
      </div>
    </div>

    <div class="event-list">
      <button
        v-for="entry in entries"
        :key="entry.id"
        class="event-row"
        @click="$emit('select-date', entry.start)"
      >
        <div class="event-row__text">
          <strong>{{ entry.title }}</strong>
          <span>{{ formatRange(entry.start, entry.end) }}</span>
        </div>
        <StatusBadge :status="entry.status" :copy="copy" compact />
      </button>
    </div>

    <button class="all-events-button" @click="$emit('open-all')">
      <IconGlyph name="list" />
      <span>{{ copy.allEvents }}</span>
    </button>
  </section>
</template>
