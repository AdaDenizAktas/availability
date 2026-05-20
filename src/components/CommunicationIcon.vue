<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  kind: { type: String, required: true },
  title: { type: String, default: '' },
  inline: { type: Boolean, default: false }
})

const iconName = computed(() => {
  const map = {
    email: 'lucide:mail',
    phone: 'lucide:phone',
    whatsapp: 'logos:whatsapp-icon',
    teams: 'logos:microsoft-teams'
  }

  return map[props.kind] ?? 'lucide:mail'
})
</script>

<template>
  <Icon
    :icon="iconName"
    :class="['comm-icon', `comm-icon--${kind}`, { 'comm-icon--inline': inline }]"
    :aria-label="title || kind"
    aria-hidden="true"
  />
</template>
