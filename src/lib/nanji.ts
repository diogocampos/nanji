const IMAWA = '今は'
const REIJI = '零時'
const SHOUGO = '正午'
const GOZEN = '午前'
const GOGO = '午後'
const JI = '時'
const FUN = '分'
const HAN = '半'
const CHOUDO = 'ちょうど'
const GORO = 'ごろ'
const DESU = 'です。'

const MAX_REGEN_ATTEMPTS: number = 10

export function getNewPhrase(
  previous?: string,
  time?: { hour: number; minute: number },
): string {
  if (!time) {
    const now = new Date()
    time = { hour: now.getHours(), minute: now.getMinutes() }
  }

  for (let i = 0; i < MAX_REGEN_ATTEMPTS; ++i) {
    const phrase = generatePhrase(time.hour, time.minute)
    if (phrase !== previous) return phrase
  }

  return previous || ''
}

function generatePhrase(hour: number, minute: number): string {
  const imawa = coinFlip() ? IMAWA : ''

  const choudo = (minute === 0 || minute === 30) && coinFlip() ? CHOUDO : ''

  let goro = ''
  const rounded = coinFlip() && round(hour, minute)
  if (rounded && (rounded.hour !== hour || rounded.minute !== minute)) {
    ;({ hour, minute } = rounded)
    goro = GORO
  }

  let ampm = ''
  if (hour % 12 > 0 && coinFlip()) {
    ampm = hour < 12 ? GOZEN : GOGO
    hour %= 12
  }

  // prettier-ignore
  const hh
    = hour === 0 && minute === 0 ? REIJI
    : hour === 12 && minute === 0 ? SHOUGO
    : `${hour}${JI}`

  // prettier-ignore
  const mm
    = minute === 0 ? ''
    : minute === 30 && (goro || coinFlip()) ? HAN
    : `${minute}${FUN}`

  const hhmm = `${hh}${mm}`
  const time = ampm || coinFlip() ? `${hhmm}${choudo}` : `${choudo}${hhmm}`

  return `${imawa}${ampm}${time}${goro}${DESU}`
}

function round(hour: number, minute: number) {
  if (minute < 5) {
    minute = 0
  } else if ((25 < minute && minute < 30) || (30 < minute && minute < 35)) {
    minute = 30
  } else if (55 < minute) {
    hour = (hour + 1) % 24
    minute = 0
  }

  return { hour, minute }
}

function coinFlip(): boolean {
  return Math.random() > 0.5
}
