<script setup>
import IconGlyph from '@/components/IconGlyph.vue'
import StatusBadge from '@/components/StatusBadge.vue'

defineProps({
  entries: { type: Array, required: true },
  formatRange: { type: Function, required: true },
  copy: { type: Object, required: true }
})

const emit = defineEmits(['select-date'])

function selectEntry(entry) {
  emit('select-date', entry.start)
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
  <section class="list-panel">
    <div class="list-panel__header">
      <div class="drawer-panel__eyebrow">
        <IconGlyph name="list" />
        <span>{{ copy.labels.scheduleTitle }}</span>
      </div>
    </div>

    <div class="list-stack">
      <button v-for="entry in entries" :key="entry.id" class="list-row" :title="entry.description" @click="selectEntry(entry)">
        <div class="list-row__left">
          <span class="list-row__glyph"><IconGlyph :name="glyphForEvent(entry)" /></span>
          <div class="list-row__textblock">
            <div class="list-row__range">{{ formatRange(entry.start, entry.end) }}</div>
            <div class="list-row__title">{{ entry.title }}</div>
          </div>
        </div>
        <StatusBadge :status="entry.status" compact hide-text :copy="copy" />
      </button>
    </div>
  </section>
</template>
