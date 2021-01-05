import { useState } from 'react'

import { getNewPhrase } from '../../lib/nanji'
import { speak } from '../../lib/speech'
import VoicePicker from '../VoicePicker'
import './styles.css'

export default function App() {
  const [phrase, setPhrase] = useState(getNewPhrase)
  const [voice, setVoice] = useState<SpeechSynthesisVoice>()
  const [slow, setSlow] = useState(false)

  function handleRefresh() {
    setPhrase(getNewPhrase(phrase))
    setSlow(false)
  }

  function handleSpeak() {
    if (voice) {
      speak(phrase, voice, { slow })
      setSlow((slow) => !slow)
    }
  }

  return (
    <div className='App'>
      <h1 className='title' title='What time is it?' lang='ja'>
        何時ですか？
      </h1>

      <p className='time' lang='ja'>
        {phrase}
      </p>

      <button onClick={handleRefresh}>Refresh</button>

      <VoicePicker lang='ja' onChange={setVoice}>
        <button onClick={handleSpeak}>Speak</button>
      </VoicePicker>
    </div>
  )
}
