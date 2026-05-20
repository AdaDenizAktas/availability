<script setup>
import IconGlyph from '@/components/IconGlyph.vue'
import StatusBadge from '@/components/StatusBadge.vue'

const props = defineProps({
  selectedDateLabel: { type: String, required: true },
  events: { type: Array, required: true },
  communication: { type: Object, required: true },
  copy: { type: Object, required: true }
})

function iconForChannel(code) {
  const map = {
    email: 'mail',
    whatsapp: 'chat',
    phone: 'phone',
    mixed: 'chat',
    async: 'wave',
    teams: 'teams'
  }

  return map[code] ?? 'chat'
}

function iconForReachability(value) {
  const map = {
    normal: 'wifi',
    delayed: 'clock',
    offline: 'leaf'
  }

  return map[value] ?? 'wifi'
}

function contactHref(kind, value) {
  if (kind === 'email' || kind === 'teams') return `mailto:${value}`
  if (kind === 'whatsapp') return `https://wa.me/${value.replace(/\D/g, '')}`
  if (kind === 'phone') return `tel:${value.replace(/\s+/g, '')}`
  return '#'
}

const contactOrder = ['email', 'whatsapp', 'phone', 'teams']
</script>

<template>
  <aside class="drawer-panel">
    <div class="drawer-panel__header">
      <div class="drawer-panel__eyebrow">
        <IconGlyph name="drawer" />
        <span>{{ copy.labels.sideInfo }}</span>
      </div>
      <h2>{{ selectedDateLabel }}</h2>
    </div>

    <article v-if="events.length" class="drawer-card">
      <div class="drawer-card__top">
        <StatusBadge :status="events[0].status" compact :copy="copy" />
        <span class="drawer-tone">
          <IconGlyph :name="iconForReachability(events[0].reachability)" />
          {{ copy.reachability[events[0].reachability] }}
        </span>
      </div>

      <h3>{{ events[0].title }}</h3>
      <p class="drawer-card__text">{{ events[0].description }}</p>

      <div class="drawer-meta-grid">
        <div class="drawer-meta-chip">
          <IconGlyph :name="iconForChannel(events[0].channelCode)" />
          <span>{{ copy.channels[events[0].channelCode] }}</span>
        </div>
        <div class="drawer-meta-chip">
          <IconGlyph name="clock" />
          <span>{{ events[0].responseText }}</span>
        </div>
        <div class="drawer-meta-chip">
          <IconGlyph name="target" />
          <span>{{ events[0].policyText }}</span>
        </div>
        <div class="drawer-meta-chip">
          <IconGlyph :name="iconForReachability(events[0].reachability)" />
          <span>{{ events[0].communicationText }}</span>
        </div>
      </div>
    </article>

    <article v-else class="drawer-card drawer-card--empty">
      <div class="drawer-card__top">
        <StatusBadge status="available" compact :copy="copy" />
        <span class="drawer-tone">
          <IconGlyph name="sun" />
          {{ copy.emptyLegend }}
        </span>
      </div>
      <h3>{{ copy.noEntry }}</h3>
      <p class="drawer-card__text">{{ copy.noEntryHint }}</p>
      <div class="drawer-meta-grid">
        <div class="drawer-meta-chip">
          <IconGlyph :name="iconForChannel(communication.channelCode)" />
          <span>{{ communication.communicationText }}</span>
        </div>
        <div class="drawer-meta-chip">
          <IconGlyph name="clock" />
          <span>{{ communication.responseText }}</span>
        </div>
        <div class="drawer-meta-chip">
          <IconGlyph name="target" />
          <span>{{ communication.policyText }}</span>
        </div>
      </div>
    </article>

    <section class="contact-strip">
      <div class="drawer-panel__eyebrow">
        <IconGlyph name="sprout" />
        <span>{{ copy.labels.contactTitle }}</span>
      </div>

      <div class="contact-grid">
        <a
          v-for="kind in contactOrder"
          :key="kind"
          class="contact-chip"
          :href="contactHref(kind, communication.contacts[kind])"
          :target="kind === 'email' || kind === 'teams' ? null : '_blank'"
          :rel="kind === 'email' || kind === 'teams' ? null : 'noreferrer'"
          :title="copy.contactHints[kind]"
        >
          <IconGlyph :name="iconForChannel(kind)" />
          <span>{{ communication.contacts[kind] }}</span>
        </a>
      </div>
    </section>
  </aside>
</template>
