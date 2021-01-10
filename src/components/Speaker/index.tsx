import { ChangeEvent, useEffect, useState } from 'react'

import { storageItem } from '../../lib/helpers'
import { isSpeaking, speak, useVoices } from '../../lib/speech'

export default function Speaker(props: {
  readonly lang: string
  readonly text: string
}) {
  const availableVoices = useVoices(props.lang)
  const [voice, setVoice] = useState<SpeechSynthesisVoice>()
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    setVoice(getInitialVoice(availableVoices))
  }, [availableVoices])

  useEffect(() => {
    setSlow(false)
  }, [props.text, voice]) // reset speed when text or voice changes

  function handleSpeak() {
    if (voice && !isSpeaking()) {
      speak(props.text, voice, { slow })
      setSlow((slow) => !slow)
    }
  }

  function handleChangeVoice(event: ChangeEvent<HTMLSelectElement>) {
    const voiceURI = event.target.value
    setVoice(setVoiceByURI(voiceURI, availableVoices))
  }

  return (
    <span className='Speaker'>
      <button disabled={!voice} onClick={handleSpeak}>
        Speak
      </button>

      <select
        value={voice?.voiceURI}
        disabled={!availableVoices.length}
        onChange={handleChangeVoice}
      >
        {availableVoices.map(({ voiceURI, name }) => (
          <option key={voiceURI} value={voiceURI}>
            {voiceURI.endsWith('.premium') ? `${name} (Enhanced)` : name}
          </option>
        ))}
      </select>
    </span>
  )
}

const [loadVoiceURI, saveVoiceURI] = storageItem('selectedVoiceURI')

function getInitialVoice(
  voices: readonly SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  const voiceURI = loadVoiceURI()
  const voice = voiceURI ? findVoiceByURI(voiceURI, voices) : undefined
  return voice || voices[0]
}

function setVoiceByURI(
  voiceURI: string,
  voices: readonly SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  const voice = findVoiceByURI(voiceURI, voices)
  if (voice) saveVoiceURI(voice.voiceURI)
  return voice
}

function findVoiceByURI(
  voiceURI: string,
  voices: readonly SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  return voices.find((voice) => voice.voiceURI === voiceURI)
}
