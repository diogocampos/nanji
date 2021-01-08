import { ChangeEvent, useEffect, useMemo, useState } from 'react'

import { getVoices, isSpeaking, speak } from '../../lib/speech'

export default function Speaker(props: {
  readonly lang: string
  readonly text: string
}) {
  const availableVoices = useMemo(() => getVoices(props.lang), [props.lang])

  const [voice, setVoice] = useState<SpeechSynthesisVoice>()
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    setVoice(availableVoices[0])
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
    const voice = availableVoices.find((voice) => voice.voiceURI === voiceURI)
    setVoice(voice)
  }

  if (!availableVoices.length) return null

  return (
    <span className='Speaker'>
      <button onClick={handleSpeak}>Speak</button>

      <select onChange={handleChangeVoice}>
        {availableVoices.map(({ voiceURI, name }) => (
          <option key={voiceURI} value={voiceURI}>
            {voiceURI.endsWith('.premium') ? `${name} (Enhanced)` : name}
          </option>
        ))}
      </select>
    </span>
  )
}
