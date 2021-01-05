import { ReactNode, useEffect, useMemo } from 'react'

import { getVoices } from '../../lib/speech'

export default function VoicePicker(props: {
  lang: string
  onChange: (voice?: SpeechSynthesisVoice) => void
  children: ReactNode
}) {
  const { onChange } = props
  const voices = useMemo(() => getVoices(props.lang), [props.lang])

  useEffect(() => {
    onChange(voices[0])
  }, [onChange, voices])

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const voiceURI = event.target.value
    const voice = voices.find((voice) => voice.voiceURI === voiceURI)
    onChange(voice)
  }

  if (!voices.length) return null

  return (
    <>
      {props.children}
      <select onChange={handleChange}>
        {voices.map(({ voiceURI, name }) => (
          <option key={voiceURI} value={voiceURI}>
            {voiceURI.endsWith('.premium') ? `${name} (Enhanced)` : name}
          </option>
        ))}
      </select>
    </>
  )
}
