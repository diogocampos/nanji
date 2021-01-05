export function getVoices(lang: string): SpeechSynthesisVoice[] {
  const voices =
    window.speechSynthesis
      ?.getVoices()
      .filter((voice) => voice.lang.startsWith(lang)) || []

  return uniqBy('voiceURI', voices)
}

export function speak(text: string, voice: SpeechSynthesisVoice) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = voice.lang
  utterance.voice = voice
  speechSynthesis.speak(utterance)
}

// Helpers

function uniqBy<T>(property: keyof T, items: T[]): T[] {
  const seen: { [_: string]: boolean | undefined } = {}

  return items.filter((item) => {
    const key = String(item[property])
    return seen[key] ? false : (seen[key] = true)
  })
}
