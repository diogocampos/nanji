export function getVoices(lang: string): SpeechSynthesisVoice[] {
  return window.speechSynthesis
    ? speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith(lang))
    : []
}

export function speak(text: string, voice: SpeechSynthesisVoice) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = voice.lang
  utterance.voice = voice
  speechSynthesis.speak(utterance)
}
