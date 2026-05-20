<script setup>
import IconGlyph from '@/components/IconGlyph.vue'
import StatusBadge from '@/components/StatusBadge.vue'

const props = defineProps({
  label: { type: String, required: true },
  events: { type: Array, required: true },
  communication: { type: Object, required: true },
  copy: { type: Object, required: true },
  locale: { type: String, required: true }
})

function channelIcon(code) {
  const map = { email: 'mail', whatsapp: 'chat', phone: 'phone', mixed: 'chat', async: 'clock', teams: 'teams' }
  return map[code] ?? 'chat'
}

function contactHref(kind, value) {
  if (kind === 'email' || kind === 'teams') return `mailto:${value}`
  if (kind === 'whatsapp') return `https://wa.me/${value.replace(/\D/g, '')}`
  if (kind === 'phone') return `tel:${value.replace(/\s+/g, '')}`
  return '#'
}

const orderedContacts = ['email', 'whatsapp', 'phone', 'teams']
</script>

<template>
  <aside class="detail-panel">
    <div class="detail-panel__header">
      <div class="detail-panel__eyebrow">{{ copy.selectedDay }}</div>
      <h2>{{ label }}</h2>
    </div>

    <article v-if="events.length" class="detail-card">
      <div class="detail-card__top">
        <StatusBadge :status="events[0].status" :copy="copy" compact />
        <span class="detail-pill">
          <IconGlyph :name="channelIcon(events[0].channelCode)" />
          {{ copy.channels[events[0].channelCode] }}
        </span>
      </div>

      <h3>{{ events[0].title }}</h3>
      <p class="detail-text">{{ events[0].description }}</p>

      <div class="detail-meta">
        <div class="detail-meta__row">
          <span>{{ copy.preferredContact }}</span>
          <strong>{{ events[0].communicationText }}</strong>
        </div>
        <div class="detail-meta__row">
          <span>{{ copy.response }}</span>
          <strong>{{ events[0].responseText }}</strong>
        </div>
        <div class="detail-meta__row">
          <span>{{ copy.policy }}</span>
          <strong>{{ events[0].policyText }}</strong>
        </div>
      </div>
    </article>

    <article v-else class="detail-card detail-card--empty">
      <div class="detail-card__top">
        <StatusBadge status="available" :copy="copy" compact />
      </div>
      <h3>{{ copy.noEntry }}</h3>
      <p class="detail-text">{{ copy.noEntryHint }}</p>

      <div class="detail-meta">
        <div class="detail-meta__row">
          <span>{{ copy.preferredContact }}</span>
          <strong>{{ communication.communicationDetails[locale] ?? communication.communicationDetails.en }}</strong>
        </div>
        <div class="detail-meta__row">
          <span>{{ copy.response }}</span>
          <strong>{{ communication.responseExpectation[locale] ?? communication.responseExpectation.en }}</strong>
        </div>
        <div class="detail-meta__row">
          <span>{{ copy.policy }}</span>
          <strong>{{ communication.priorityPolicy[locale] ?? communication.priorityPolicy.en }}</strong>
        </div>
      </div>
    </article>

    <div class="contact-grid">
      <a
        v-for="kind in orderedContacts"
        :key="kind"
        class="contact-chip"
        :href="contactHref(kind, communication.contacts[kind])"
        :title="copy.contactHints[kind]"
        :target="kind === 'email' || kind === 'teams' ? null : '_blank'"
        :rel="kind === 'email' || kind === 'teams' ? null : 'noreferrer'"
      >
        <IconGlyph :name="channelIcon(kind)" />
        <span>{{ communication.contacts[kind] }}</span>
      </a>
    </div>
  </aside>
</template>
