<script setup>
import { computed, onMounted, ref } from 'vue'
import IconGlyph from './components/IconGlyph.vue'
import CommunicationIcon from './components/CommunicationIcon.vue'
import { copy as fallbackCopy, locales as fallbackLocales } from './i18n'
import { loadAvailabilityConfig } from './services/availabilityStore'
import {
  buildMonthGrid,
  formatDateRange,
  formatMonthTitle,
  formatReadableDate,
  getWeekdayLabels,
  isDateInRange,
  shiftMonth,
  startOfToday,
  startOfWeek,
  endOfWeek,
  toISODate,
  toLocalDate
} from './utils/calendar'

const locale = ref('en')
const availabilityConfig = ref(null)
const todayBase = startOfToday()
const todayIso = toISODate(todayBase)
const monthFocus = ref(new Date(todayBase.getFullYear(), todayBase.getMonth(), 1))
const selectedDate = ref(todayIso)
const showAllEvents = ref(false)

const appLocales = computed(() => availabilityConfig.value?.meta?.locales ?? fallbackLocales)
const t = computed(() => availabilityConfig.value?.labels?.[locale.value] ?? fallbackCopy[locale.value] ?? fallbackCopy.en)

const symbolMap = {
  power: { glyph: '⚡', labelKey: 'legendPower' },
  renovation: { glyph: '▧', labelKey: 'legendRenovation' },
  camping: { glyph: '🌲', labelKey: 'legendCamping' },
  delivery: { glyph: '◇', labelKey: 'legendDelivery' },
  focus: { glyph: '●', labelKey: 'legendFocus' },
  chat: { glyph: '≈', labelKey: 'legendCommunication' },
  moon: { glyph: '◐', labelKey: 'legendQuiet' },
  build: { glyph: '▦', labelKey: 'legendBuild' }
}

function localText(source) {
  return source?.[locale.value] ?? source?.en ?? ''
}

const calendarEntries = computed(() => availabilityConfig.value?.events ?? [])
const defaultCommunication = computed(() => availabilityConfig.value?.channels ?? {
  channelCode: 'mixed',
  reachability: 'normal',
  contacts: {
    email: 'ada.deniz.aktas0@gmail.com',
    teams: 'ada.deniz.aktas0@gmail.com',
    whatsapp: '+90 553 190 57 24',
    phone: '+90 553 190 57 24'
  }
})

function getEventsForDate(isoDate) {
  return calendarEntries.value.filter((entry) => isDateInRange(isoDate, entry.start, entry.end))
}

function getDayState(isoDate) {
  const events = getEventsForDate(isoDate)
  if (events.some((entry) => entry.status === 'unavailable')) return 'busy'
  if (events.some((entry) => entry.status === 'limited')) return 'partial'
  return 'available'
}

function getPrimaryEvent(isoDate) {
  const events = getEventsForDate(isoDate)
  return events.find((entry) => entry.status === 'unavailable')
    ?? events.find((entry) => entry.status === 'limited')
    ?? null
}

function selectDate(isoDate) {
  selectedDate.value = isoDate
  const date = toLocalDate(isoDate)
  monthFocus.value = new Date(date.getFullYear(), date.getMonth(), 1)
}

function buildContactEntries(contacts = defaultCommunication.value.contacts) {
  return [
    { key: 'email', value: contacts.email, href: `mailto:${contacts.email}`, external: false },
    { key: 'whatsapp', value: contacts.whatsapp, href: `https://wa.me/${contacts.whatsapp.replace(/\D/g, '')}`, external: true },
    { key: 'teams', value: contacts.teams, href: `mailto:${contacts.teams}`, external: false },
    { key: 'phone', value: contacts.phone, href: `tel:${contacts.phone.replace(/\s+/g, '')}`, external: false }
  ]
}

function contactTitle(key, value) {
  return `${t.value[key]} — ${value}`
}

function bestReachKeys(entry) {
  const code = entry?.channelCode ?? defaultCommunication.value.channelCode
  const map = {
    email: ['email'],
    whatsapp: ['whatsapp'],
    phone: ['phone'],
    teams: ['teams'],
    mixed: ['email', 'whatsapp'],
    async: ['email']
  }
  return map[code] ?? ['email']
}

function bestReachEntriesForEntry(entry) {
  const contacts = buildContactEntries(defaultCommunication.value.contacts)
  const keys = bestReachKeys(entry)
  return keys.map((key) => contacts.find((contact) => contact.key === key)).filter(Boolean)
}

const topContacts = computed(() => buildContactEntries(defaultCommunication.value.contacts))
const weekdayLabels = computed(() => getWeekdayLabels(locale.value))
const monthLabel = computed(() => formatMonthTitle(monthFocus.value, locale.value))
const currentWeekStartIso = computed(() => toISODate(startOfWeek(todayBase)))
const currentWeekEndIso = computed(() => toISODate(endOfWeek(todayBase)))

const monthCells = computed(() => buildMonthGrid(monthFocus.value).map((cell) => ({
  ...cell,
  dayState: getDayState(cell.iso),
  event: getPrimaryEvent(cell.iso),
  inCurrentWeek: cell.iso >= currentWeekStartIso.value && cell.iso <= currentWeekEndIso.value,
  isToday: cell.iso === todayIso,
  isWeekend: [0, 6].includes(cell.date.getDay())
})))

const todayDayState = computed(() => getDayState(todayIso))
const todayCommunication = computed(() => getPrimaryEvent(todayIso) ?? defaultCommunication.value)
const todayBestReach = computed(() => bestReachEntriesForEntry(todayCommunication.value))

const selectedEvents = computed(() => getEventsForDate(selectedDate.value))
const selectedPrimaryEvent = computed(() => getPrimaryEvent(selectedDate.value))
const selectedLabel = computed(() => formatReadableDate(selectedDate.value, locale.value))
const selectedBestReach = computed(() => bestReachEntriesForEntry(selectedPrimaryEvent.value ?? defaultCommunication.value))

const nextFiveEvents = computed(() => {
  return [...calendarEntries.value]
    .filter((entry) => entry.end >= todayIso)
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 5)
})

const oneYearEvents = computed(() => {
  const end = new Date(todayBase)
  end.setFullYear(end.getFullYear() + 1)
  const endIso = toISODate(end)

  return [...calendarEntries.value]
    .filter((entry) => entry.end >= todayIso && entry.start <= endIso)
    .sort((a, b) => a.start.localeCompare(b.start))
})

const selectedIndicatorKeys = computed(() => {
  const keys = selectedEvents.value
    .map((entry) => entry.visibilityKey)
    .filter(Boolean)
  return [...new Set(keys)]
})

const selectedIndicators = computed(() => selectedIndicatorKeys.value.map((key) => ({
  key,
  glyph: symbolMap[key]?.glyph ?? '●',
  label: symbolMap[key]?.labelKey ? t.value[symbolMap[key].labelKey] : ''
})))

function moveMonth(delta) {
  monthFocus.value = shiftMonth(monthFocus.value, delta)
}

function statusLabelFromDayState(state) {
  const map = {
    available: t.value.open,
    partial: t.value.limited,
    busy: t.value.unavailable
  }
  return map[state] ?? t.value.open
}

function responseLabel(mode) {
  return t.value[{ normal: 'normal', delayed: 'delayed', offline: 'offline' }[mode] ?? 'normal']
}

function rangeLabelForEvent(entry) {
  return formatDateRange(entry.start, entry.end, locale.value)
}

function eventSymbol(entry) {
  return symbolMap[entry?.visibilityKey]?.glyph ?? '●'
}

function eventSymbolTitle(entry) {
  const key = symbolMap[entry?.visibilityKey]?.labelKey
  return key ? t.value[key] : ''
}

function openEvent(entry) {
  selectDate(entry.start)
}

const tasksHref = '/tasks/'

onMounted(async () => {
  try {
    const loaded = await loadAvailabilityConfig()
    availabilityConfig.value = loaded
    const preferredLocale = loaded?.meta?.defaultLocale
    if (preferredLocale && appLocales.value.includes(preferredLocale)) {
      locale.value = preferredLocale
    }
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="board-shell">
    <header class="topbar">
      <div class="topbar-main">
        <p class="eyebrow">A.D.A.</p>
        <h1>{{ t.availability }}</h1>
      </div>

      <div class="topbar-actions">
        <div class="locale-switch" role="tablist" :aria-label="t.language">
          <button
            v-for="code in appLocales"
            :key="code"
            class="flag-button"
            :class="{ 'flag-button--active': locale === code }"
            :title="t[code]"
            :aria-label="t[code]"
            @click="locale = code"
          >
            <span aria-hidden="true" class="flag-rect" :class="`flag-rect--${code}`"></span>
          </button>
        </div>

        <div class="contact-strip" :aria-label="t.communicationChannels">
          <span class="contact-strip__label">{{ t.communicationChannels }}</span>
          <div class="contact-strip__icons">
            <a
              v-for="contact in topContacts"
              :key="contact.key"
              class="contact-icon"
              :href="contact.href"
              :title="contactTitle(contact.key, contact.value)"
              :aria-label="contactTitle(contact.key, contact.value)"
              :target="contact.external ? '_blank' : null"
              :rel="contact.external ? 'noreferrer' : null"
            >
              <CommunicationIcon :kind="contact.key" :title="t[contact.key]" />
            </a>
          </div>
        </div>
      </div>
    </header>

    <section class="status-strip panel">
      <div class="status-strip__block">
        <span class="mini-label">{{ t.currentState }}</span>
        <div class="status-line">
          <span class="signal-dot" :class="`signal-dot--${todayDayState}`"></span>
          <strong>{{ statusLabelFromDayState(todayDayState) }}</strong>
        </div>
      </div>
      <div class="status-strip__block">
        <span class="mini-label">{{ t.bestReach }}</span>
        <strong>{{ todayBestReach.map((item) => t[item.key]).join(' + ') }}</strong>
      </div>
      <div class="status-strip__block">
        <span class="mini-label">{{ t.responseWindow }}</span>
        <strong>{{ responseLabel(todayCommunication.reachability) }}</strong>
      </div>
      <div class="status-strip__block">
        <span class="mini-label">{{ t.updated }}</span>
        <strong>{{ availabilityConfig?.meta?.updatedAt ? formatReadableDate(availabilityConfig.meta.updatedAt.slice(0,10), locale.value) : formatReadableDate(todayIso, locale.value) }}</strong>
      </div>
      <a class="action-button" :href="tasksHref">
        <IconGlyph name="open" />
        <span>{{ t.createRequest }}</span>
      </a>
    </section>

    <main class="board-grid">
      <section class="panel month-panel">
        <div class="panel-head">
          <div>
            <h2>{{ t.month }}</h2>
            <p>{{ monthLabel }}</p>
          </div>
          <div class="nav-group">
            <button class="nav-button nav-button--text" :title="t.previous" @click="moveMonth(-1)">&lt;</button>
            <button class="nav-button nav-button--muted" :title="t.currentMonth" @click="monthFocus = new Date(todayBase.getFullYear(), todayBase.getMonth(), 1); selectedDate = todayIso">
              <IconGlyph name="pin" />
            </button>
            <button class="nav-button nav-button--text" :title="t.next" @click="moveMonth(1)">&gt;</button>
          </div>
        </div>

        <div class="month-grid month-grid--labels">
          <span v-for="label in weekdayLabels" :key="label" class="month-label">{{ label }}</span>
        </div>

        <div class="month-grid">
          <button
            v-for="cell in monthCells"
            :key="cell.iso"
            class="month-cell"
            :class="[
              `month-cell--${cell.dayState}`,
              {
                'month-cell--inactive': !cell.inMonth,
                'month-cell--active': selectedDate === cell.iso,
                'month-cell--current-week': cell.inCurrentWeek,
                'month-cell--today': cell.isToday,
                'month-cell--weekend': cell.isWeekend
              }
            ]"
            :title="cell.event ? localText(cell.event.titles) : formatReadableDate(cell.iso, locale)"
            @click="selectDate(cell.iso)"
          >
            <span class="month-cell__date">{{ cell.date.getDate() }}</span>
            <span class="month-cell__signal" :class="`month-cell__signal--${cell.dayState}`"></span>
            <span v-if="cell.isWeekend" class="month-cell__weekend" :title="t.weekend">⌂</span>
            <span class="month-cell__symbol" :title="cell.event ? eventSymbolTitle(cell.event) : ''">{{ cell.event ? eventSymbol(cell.event) : '' }}</span>
          </button>
        </div>
      </section>

      <aside class="side-stack">
        <section class="panel inspector-panel">
          <div class="detail-head">
            <h2>{{ selectedLabel }}</h2>
            <span class="response-badge">{{ t.selectedDay }}</span>
          </div>

          <dl class="inspector-grid inspector-grid--clean">
            <div>
              <dt>{{ t.bestReach }}</dt>
              <dd class="reach-list">
                <a
                  v-for="item in selectedBestReach"
                  :key="item.key"
                  class="reach-link"
                  :href="item.href"
                  :title="contactTitle(item.key, item.value)"
                  :target="item.external ? '_blank' : null"
                  :rel="item.external ? 'noreferrer' : null"
                >
                  <CommunicationIcon :kind="item.key" :title="t[item.key]" inline />
                  <span>{{ t[item.key] }}</span>
                </a>
              </dd>
            </div>

            <div>
              <dt>{{ t.notes }}</dt>
              <dd>{{ selectedPrimaryEvent ? localText(selectedPrimaryEvent.descriptions) : t.contactHint }}</dd>
            </div>

            <div v-if="selectedIndicators.length">
              <dt>{{ t.indicators }}</dt>
              <dd class="indicator-list indicator-list--glyphs">
                <span v-for="indicator in selectedIndicators" :key="indicator.key" class="indicator-pill" :title="indicator.label">
                  <span class="event-row__symbol">{{ indicator.glyph }}</span>
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <section v-if="selectedIndicators.length" class="panel legend-panel legend-panel--selected">
          <div class="panel-head panel-head--compact">
            <div>
              <h2>{{ t.legend }}</h2>
            </div>
          </div>
          <div class="legend-stack">
            <div v-for="indicator in selectedIndicators" :key="indicator.key" class="legend-row">
              <span class="symbol-badge">{{ indicator.glyph }}</span>
              <span>{{ indicator.label }}</span>
            </div>
          </div>
        </section>

        <section class="panel events-panel">
          <div class="panel-head panel-head--compact">
            <div>
              <h2>{{ t.upcomingEvents }}</h2>
            </div>
          </div>

          <div class="event-list">
            <button v-for="event in nextFiveEvents" :key="event.id" class="event-row event-row--list" @click="openEvent(event)">
              <span class="event-row__left">
                <span class="signal-dot" :class="`signal-dot--${event.status === 'unavailable' ? 'busy' : event.status === 'limited' ? 'partial' : 'available'}`"></span>
                <span class="event-row__symbol" :title="eventSymbolTitle(event)">{{ eventSymbol(event) }}</span>
                <span>{{ localText(event.titles) }}</span>
              </span>
              <span class="event-row__right">{{ rangeLabelForEvent(event) }}</span>
            </button>
          </div>

          <button class="all-events-button" @click="showAllEvents = true">{{ t.allEvents }}</button>
        </section>
      </aside>
    </main>

    <div v-if="showAllEvents" class="overlay" @click.self="showAllEvents = false">
      <div class="modal-card modal-card--wide">
        <div class="panel-head panel-head--compact">
          <div>
            <h2>{{ t.allEvents }}</h2>
            <p>365 days</p>
          </div>
          <button class="nav-button" :title="t.close" @click="showAllEvents = false"><IconGlyph name="close" /></button>
        </div>

        <div class="event-list">
          <button v-for="event in oneYearEvents" :key="event.id" class="event-row event-row--list" @click="openEvent(event); showAllEvents = false">
            <span class="event-row__left">
              <span class="signal-dot" :class="`signal-dot--${event.status === 'unavailable' ? 'busy' : event.status === 'limited' ? 'partial' : 'available'}`"></span>
              <span class="event-row__symbol" :title="eventSymbolTitle(event)">{{ eventSymbol(event) }}</span>
              <span>{{ localText(event.titles) }}</span>
            </span>
            <span class="event-row__right">{{ rangeLabelForEvent(event) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
