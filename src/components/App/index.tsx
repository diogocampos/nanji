import { useState } from 'react'

import { getNewPhrase } from '../../lib/nanji'
import { speak } from '../../lib/speech'
import VoicePicker from '../VoicePicker'
import './styles.css'

export default function App() {
  const [phrase, setPhrase] = useState(getNewPhrase)
  const [voice, setVoice] = useState<SpeechSynthesisVoice>()

  function handleRegenerate() {
    setPhrase(getNewPhrase(phrase))
  }

  function handleSpeak() {
    if (voice) speak(phrase, voice)
  }

  return (
    <div className='App'>
      <h1 className='title' title='What time is it?' lang='ja'>
        何時ですか？
      </h1>

      <p className='time' lang='ja'>
        {phrase}
      </p>

      <button onClick={handleRegenerate}>Regenerate</button>

      <VoicePicker lang='ja' onChange={setVoice}>
        <button onClick={handleSpeak}>Speak</button>
      </VoicePicker>
    </div>
  )
}
