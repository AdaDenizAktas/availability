export const calendarEntries = [
  {
    id: 'maintenance-may',
    start: '2026-05-12',
    end: '2026-05-14',
    status: 'unavailable',
    reachability: 'delayed',
    channelCode: 'email',
    visibilityKey: 'power',
    titles: {
      en: 'Reserved',
      fr: 'Réservé',
      de: 'Reserviert',
      es: 'Reservado'
    },
    descriptions: {
      en: 'Planned electrical maintenance and equipment reset. Clear written requests stay reviewable.',
      fr: 'Maintenance électrique planifiée et réinitialisation du matériel. Les demandes écrites claires restent consultables.',
      de: 'Geplante Elektro-Wartung und Geräte-Reset. Klare schriftliche Anfragen bleiben prüfbar.',
      es: 'Mantenimiento eléctrico planificado y reinicio de equipos. Las solicitudes escritas claras siguen siendo revisables.'
    }
  },
  {
    id: 'renovation-week',
    start: '2026-05-18',
    end: '2026-05-22',
    status: 'limited',
    reachability: 'delayed',
    channelCode: 'mixed',
    visibilityKey: 'renovation',
    titles: {
      en: 'Focused',
      fr: 'Concentré',
      de: 'Fokussiert',
      es: 'Enfocado'
    },
    descriptions: {
      en: 'House renovation week. Precise requests still move well; response speed is simply batched.',
      fr: 'Semaine de rénovation. Les demandes précises avancent bien ; la vitesse de réponse est seulement groupée.',
      de: 'Renovierungswoche. Präzise Anfragen laufen weiter gut; die Antwortgeschwindigkeit ist nur gebündelt.',
      es: 'Semana de renovación. Las solicitudes precisas siguen avanzando bien; la velocidad de respuesta solo va por lotes.'
    }
  },
  {
    id: 'off-grid-trip',
    start: '2026-05-27',
    end: '2026-05-30',
    status: 'unavailable',
    reachability: 'offline',
    channelCode: 'email',
    visibilityKey: 'camping',
    titles: {
      en: 'On Site',
      fr: 'Sur site',
      de: 'Vor Ort',
      es: 'En sitio'
    },
    descriptions: {
      en: 'Camping block with weak or no signal. Clear written requests are safest for the return pass.',
      fr: 'Bloc camping avec signal faible ou nul. Les demandes écrites claires sont les plus sûres pour le retour.',
      de: 'Camping-Block mit schwachem oder keinem Signal. Klare schriftliche Anfragen sind am sichersten für die Rückkehr.',
      es: 'Bloque de camping con señal débil o nula. Las solicitudes escritas claras son lo más seguro para la vuelta.'
    }
  },
  {
    id: 'urgent-only-day',
    start: '2026-06-03',
    end: '2026-06-03',
    status: 'limited',
    reachability: 'normal',
    channelCode: 'whatsapp',
    visibilityKey: 'delivery',
    titles: {
      en: 'On Site',
      fr: 'Sur site',
      de: 'Vor Ort',
      es: 'En sitio'
    },
    descriptions: {
      en: 'External run day. Short urgent items move fastest.',
      fr: 'Jour de course externe. Les petits sujets urgents avancent le plus vite.',
      de: 'Tag mit externem Lauf. Kurze dringende Punkte laufen am schnellsten.',
      es: 'Día de salida externa. Los asuntos urgentes cortos avanzan más rápido.'
    }
  }
]

export const defaultCommunication = {
  channelCode: 'mixed',
  reachability: 'normal',
  contacts: {
    email: 'ada.deniz.aktas0@gmail.com',
    teams: 'ada.deniz.aktas0@gmail.com',
    whatsapp: '+90 553 190 57 24',
    phone: '+90 553 190 57 24'
  }
}
