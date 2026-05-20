<script setup>
import IconGlyph from '@/components/IconGlyph.vue'
import StatusBadge from '@/components/StatusBadge.vue'

defineProps({
  open: { type: Boolean, required: true },
  entries: { type: Array, required: true },
  copy: { type: Object, required: true },
  formatRange: { type: Function, required: true }
})

const emit = defineEmits(['close', 'select-date'])
</script>

<template>
  <div v-if="open" class="overlay" @click.self="$emit('close')">
    <div class="modal-card modal-card--wide">
      <div class="modal-card__header">
        <div>
          <div class="section-card__title">{{ copy.allEvents }}</div>
          <div class="section-card__label">{{ copy.untilOneYear }}</div>
        </div>
        <button class="icon-button" :title="copy.close" @click="$emit('close')"><IconGlyph name="close" /></button>
      </div>

      <div class="modal-list">
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
    </div>
  </div>
</template>
