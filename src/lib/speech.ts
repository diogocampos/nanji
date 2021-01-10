import { useEffect, useState } from 'react'

export function getVoices(lang: string = ''): SpeechSynthesisVoice[] {
  if (!window.speechSynthesis) return []

  const voices = speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.startsWith(lang))

  return uniqBy('voiceURI', voices)
}

export function useVoices(lang: string = ''): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    setVoices(getVoices(lang))
  }, [lang])

  useEffect(() => {
    if (!window.speechSynthesis?.addEventListener) return
    const handler = () => setVoices(getVoices(lang))

    speechSynthesis.addEventListener('voiceschanged', handler)
    return () => speechSynthesis.removeEventListener('voiceschanged', handler)
  }, [lang])

  return voices
}

export function speak(
  text: string,
  voice: SpeechSynthesisVoice,
  options: { readonly slow?: boolean } = {},
): void {
  if (!window.speechSynthesis) return
  const { slow = false } = options

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = voice.lang
  utterance.voice = voice
  if (slow) utterance.rate = 0.6

  speechSynthesis.speak(utterance)
}

export function isSpeaking(): boolean {
  return window.speechSynthesis?.speaking || false
}

// Helpers

function uniqBy<T>(property: keyof T, items: readonly T[]): T[] {
  const seen: { [_: string]: boolean | undefined } = {}

  return items.filter((item) => {
    const key = String(item[property])
    return seen[key] ? false : (seen[key] = true)
  })
}
