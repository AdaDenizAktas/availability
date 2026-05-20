<script setup>
import { computed } from 'vue'
import IconGlyph from '@/components/IconGlyph.vue'

const props = defineProps({
  status: { type: String, required: true },
  copy: { type: Object, required: true },
  compact: { type: Boolean, default: false },
  hideText: { type: Boolean, default: false }
})

const meta = computed(() => {
  const map = {
    available: { icon: 'sun', label: props.copy.status.available },
    limited: { icon: 'wave', label: props.copy.status.limited },
    unavailable: { icon: 'leaf', label: props.copy.status.unavailable }
  }
  return map[props.status] ?? map.available
})
</script>

<template>
  <span class="status-badge" :data-status="status" :class="{ 'status-badge--compact': compact }">
    <IconGlyph :name="meta.icon" :title="meta.label" />
    <span v-if="!hideText">{{ meta.label }}</span>
  </span>
</template>
