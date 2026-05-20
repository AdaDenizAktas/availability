<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  title: { type: String, default: '' }
})

const icons = {
  chat: { viewBox: '0 0 24 24', paths: ['M6 5h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H11l-5 4v-4H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z'] },
  phone: { viewBox: '0 0 24 24', paths: ['M6.5 4.8c.9-.9 2.3-.9 3.2 0l1.8 1.8c.8.8.9 2 .2 2.9l-1.1 1.4a14.5 14.5 0 0 0 2.5 2.9 14.5 14.5 0 0 0 2.9 2.5l1.4-1.1c.9-.7 2.1-.6 2.9.2l1.8 1.8c.9.9.9 2.3 0 3.2l-.8.8c-.8.8-2 1.2-3.1 1-3.4-.6-6.6-2.4-9.7-5.5S5.9 10 5.3 6.6c-.2-1.1.2-2.3 1-3.1l.2-.2Z'] },
  mail: { viewBox: '0 0 24 24', paths: ['M4 7h16v10H4z', 'm4 0 4 4 4-4'] },
  teams: { viewBox: '0 0 24 24', paths: ['M4 7h10v10H4z', 'M9 7v10', 'M15 9h5v8h-5z', 'M17.5 7.2a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z'] },
  calendar: { viewBox: '0 0 24 24', paths: ['M7.5 2.8v3.1', 'M16.5 2.8v3.1', 'M4 8.3h16', 'M5.3 5.5h13.4A1.8 1.8 0 0 1 20.5 7.3v10.9a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8V7.3a1.8 1.8 0 0 1 1.8-1.8Z'] },
  list: { viewBox: '0 0 24 24', paths: ['M8 7h12', 'M8 12h12', 'M8 17h12', 'M4 7h.01', 'M4 12h.01', 'M4 17h.01'] },
  wifi: { viewBox: '0 0 24 24', paths: ['M4.5 9.8a11.9 11.9 0 0 1 15 0', 'M7.5 13a7.7 7.7 0 0 1 9 0', 'M10.3 16a3.7 3.7 0 0 1 3.4 0', 'M12 19h.01'] },
  clock: { viewBox: '0 0 24 24', paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 7.5v5l3.4 2'] },
  pin: { viewBox: '0 0 24 24', paths: ['M12 21s-5.5-5.1-5.5-10A5.5 5.5 0 1 1 17.5 10c0 4.9-5.5 10-5.5 10Z', 'M12 12.1a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z'] },
  bolt: { viewBox: '0 0 24 24', paths: ['M13.2 2.8 6.8 12h4.1L9.8 21.2 17.2 11h-4z'] },
  hammer: { viewBox: '0 0 24 24', paths: ['m14.8 4.5 4.7 4.7-2.1 2.1-4.7-4.7z', 'm13.8 5.5-8.9 8.9', 'm4.5 17.4 2.1 2.1'] },
  leaf: { viewBox: '0 0 24 24', paths: ['M18.5 5.5C10 5.5 6 10.5 5 18c7.5-1 12.5-5 13.5-13.5Z', 'M8 16c2-2 4.8-4.2 8.5-6.3'] },
  wave: { viewBox: '0 0 24 24', paths: ['M3 14c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4'] },
  sun: { viewBox: '0 0 24 24', paths: ['M12 4v2.5', 'M12 17.5V20', 'M4 12h2.5', 'M17.5 12H20', 'M6.6 6.6l1.8 1.8', 'M15.6 15.6l1.8 1.8', 'M6.6 17.4l1.8-1.8', 'M15.6 8.4l1.8-1.8', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'] },
  arrowLeft: { viewBox: '0 0 24 24', paths: ['M20 12H7', 'm0 0-5-5', 'm5 5-5 5'] },
  arrowRight: { viewBox: '0 0 24 24', paths: ['M4 12h13', 'm0 0 5-5', 'm-5 5 5 5'] },
  target: { viewBox: '0 0 24 24', paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z', 'M12 3v3', 'M12 18v3', 'M3 12h3', 'M18 12h3'] },
  question: { viewBox: '0 0 24 24', paths: ['M9.1 9.3a3 3 0 0 1 5.8 1c0 2-2.1 2.5-2.8 3.8', 'M12 17.4h.01', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z'] },
  close: { viewBox: '0 0 24 24', paths: ['M6 6l12 12', 'M18 6 6 18'] },
  open: { viewBox: '0 0 24 24', paths: ['M7 12h10', 'M12 7l5 5-5 5'] }
}

const icon = computed(() => icons[props.name] ?? icons.calendar)
</script>

<template>
  <svg class="icon-glyph" :viewBox="icon.viewBox" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <title v-if="title">{{ title }}</title>
    <path v-for="path in icon.paths" :key="path" :d="path" />
  </svg>
</template>
