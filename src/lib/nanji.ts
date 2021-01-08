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

const JI = r('時', '-ji')
const FUN = r('分', '-fun')
const PUN = r('分', '-pun')

const HOURS = [
  R(r('0', 'zero'), JI),
  R(r('1', 'ichi'), JI),
  R(r('2', 'ni'), JI),
  R(r('3', 'san'), JI),
  R(r('4', 'yo'), JI),
  R(r('5', 'go'), JI),
  R(r('6', 'roku'), JI),
  R(r('7', 'shichi'), JI),
  R(r('8', 'hachi'), JI),
  R(r('9', 'ku'), JI),
  R(r('0', 'jū'), JI),
]

const MINUTES = [
  R(),
  R(r('1', 'ip'), PUN),
  R(r('2', 'ni'), FUN),
  R(r('3', 'san'), PUN),
  R(r('4', 'yon'), PUN),
  R(r('5', 'go'), FUN),
  R(r('6', 'rop'), PUN),
  R(r('7', 'nana'), FUN),
  R(r('8', 'hap'), PUN),
  R(r('9', 'kyū'), FUN),
  R(r('0', 'jūp'), PUN),
]

const TENS = [
  R(),
  r('1', 'jū'),
  r('2', 'ni-jū'),
  r('3', 'san-jū'),
  r('4', 'yon-jū'),
  r('5', 'go-jū'),
]

const TENS_PREFIX = [
  R(),
  r('1', ''),
  r('2', 'ni-'),
  r('3', 'san-'),
  r('4', 'yon-'),
  r('5', 'go-'),
]

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
    : getHourSegment(hour)

  // prettier-ignore
  const mm
    = minute === 0 ? R()
    : minute === 30 && (goro.length || coinFlip()) ? HAN
    : getMinuteSegment(minute)

  const hhmm = R(hh, mm)
  const time = ampm.length || coinFlip() ? R(hhmm, choudo) : R(choudo, hhmm)

  const desu = imawa.length || coinFlip() ? DESU : R()

  return R(imawa, ampm, time, goro, desu)
}

function getHourSegment(hour: number): Ruby {
  return getTimeSegment(hour, HOURS)
}

function getMinuteSegment(minute: number): Ruby {
  return getTimeSegment(minute, MINUTES)
}

function getTimeSegment(value: number, units: Ruby[]): Ruby {
  const tens = Math.floor(value / 10)
  const ones = value % 10

  const tensRubies = ones > 0 ? R(TENS[tens]) : R()
  // prettier-ignore
  const onesRubies
    = ones > 0 ? units[ones]
    : /* ones === 0 && */ tens > 0 ? R(TENS_PREFIX[tens], units[10])
    : /* ones === 0 && tens === 0 */ units[0]

  return R(tensRubies, onesRubies)
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
