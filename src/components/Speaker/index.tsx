import { ChangeEvent, useCallback, useEffect, useState } from 'react'

import { storageItem } from '../../lib/helpers'
import { isSpeaking, speak, useVoices } from '../../lib/speech'
import Button from '../Button'

export default function Speaker(props: {
  lang: string
  content: { toString: () => string }
}) {
  const { state, actions } = useSpeaker(props.lang, props.content)

  function handleChangeVoice(event: ChangeEvent<HTMLSelectElement>) {
    actions.selectVoiceByURI(event.target.value)
  }

  return (
    <span className='Speaker'>
      <Button disabled={!state.voice} onClick={actions.speakContent}>
        Speak
      </Button>

      <select
        value={state.voice?.voiceURI}
        disabled={!state.availableVoices.length}
        onChange={handleChangeVoice}
      >
        {state.availableVoices.map(({ voiceURI, name }) => (
          <option key={voiceURI} value={voiceURI}>
            {voiceURI.endsWith('.premium') ? `${name} (Enhanced)` : name}
          </option>
        ))}
      </select>
    </span>
  )
}

function useSpeaker(lang: string, content: { toString: () => string }) {
  const availableVoices = useVoices(lang)
  const [voice, setVoice] = useState<SpeechSynthesisVoice>()
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    setVoice(getInitialVoice(availableVoices))
  }, [availableVoices])

  useEffect(() => {
    setSlow(false)
  }, [content, voice]) // reset speed when content or voice changes

  const speakContent = useCallback(() => {
    if (voice && !isSpeaking()) {
      speak(content.toString(), voice, { slow })
      setSlow((slow) => !slow)
    }
  }, [voice, content, slow])

  const selectVoiceByURI = useCallback(
    (voiceURI: string) => setVoice(setVoiceByURI(voiceURI, availableVoices)),
    [availableVoices],
  )

  return {
    state: { voice, availableVoices },
    actions: { speakContent, selectVoiceByURI },
  }
}

// Helpers

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
