const pad = (n) => String(n).padStart(2, '0')

/* "2026-11-29T13:00:00" (IST) → UTC iCal stamp */
function icsStamp(localIST, addHours = 0) {
  const d = new Date(`${localIST}+05:30`)
  d.setTime(d.getTime() + addHours * 3600e3)
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
}

export function downloadICS({ id, title, en, start, hours = 2, location = 'Ujjain', details = '' }) {
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jitendra-Anshika Wedding//HI',
    'BEGIN:VEVENT',
    `UID:${id}-jitendra-anshika-2026`,
    `DTSTAMP:${icsStamp('2026-11-01T00:00:00')}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(start, hours)}`,
    `SUMMARY:${title} (${en}) · जितेन्द्र ❤ अंशिका`,
    `LOCATION:${location}`,
    `DESCRIPTION:${details}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([body], { type: 'text/calendar;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${id}.ics`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}

export const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

