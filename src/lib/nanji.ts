import Ruby, { r, R } from './ruby'

const IMAWA = R(r('今', 'ima'), r('は', 'wa'))
const REIJI = R(r('零', 'rei'), r('時', 'ji'))
const SHOUGO = R(r('正', 'shō'), r('午', 'go'))
const GOZEN = R(r('午', 'go'), r('前', 'zen'))
const GOGO = R(r('午', 'go'), r('後', 'go'))
const HAN = r('半', 'han')
const CHOUDO = R(r('ちょう', 'chō'), r('ど', 'do'))
const GORO = R(r('ご', 'go'), r('ろ', 'ro'))
const DESU = R(r('で', 'de'), r('す', 'su'), r('。', ''))

const JI = '時'
const FUN = '分'

const MAX_REGEN_ATTEMPTS: number = 10

export function getNewPhrase(
  previous: Ruby = R(),
  time?: { readonly hour: number; readonly minute: number },
): Ruby {
  if (!time) {
    const now = new Date()
    time = { hour: now.getHours(), minute: now.getMinutes() }
  }

  const previousString = previous.toString()

  for (let i = 0; i < MAX_REGEN_ATTEMPTS; ++i) {
    const phrase = generatePhrase(time.hour, time.minute)
    if (phrase.toString() !== previousString) return phrase
  }

  return previous
}

function generatePhrase(hour: number, minute: number): Ruby {
  const imawa = coinFlip() ? IMAWA : R()

  const choudo = (minute === 0 || minute === 30) && coinFlip() ? CHOUDO : R()

  let goro = R()
  const rounded = coinFlip() && round(hour, minute)
  if (rounded && (rounded.hour !== hour || rounded.minute !== minute)) {
    ;({ hour, minute } = rounded)
    goro = GORO
  }

  let ampm = R()
  if (hour % 12 > 0 && coinFlip()) {
    ampm = hour < 12 ? GOZEN : GOGO
    hour %= 12
  }

  // prettier-ignore
  const hh
    = hour === 0 && minute === 0 ? REIJI
    : hour === 12 && minute === 0 ? SHOUGO
    : r(`${hour}${JI}`, '')

  // prettier-ignore
  const mm
    = minute === 0 ? R()
    : minute === 30 && (goro.length || coinFlip()) ? HAN
    : r(`${minute}${FUN}`, '')

  const hhmm = R(hh, mm)
  const time = ampm.length || coinFlip() ? R(hhmm, choudo) : R(choudo, hhmm)

  return R(imawa, ampm, time, goro, DESU)
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
