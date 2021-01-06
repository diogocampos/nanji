import { useState } from 'react'

import { getNewPhrase } from '../../lib/nanji'
import { speak } from '../../lib/speech'
import VoicePicker from '../VoicePicker'
import './styles.css'

export default function App() {
  const [phrase, setPhrase] = useState(getNewPhrase)
  const [voice, setVoice] = useState<SpeechSynthesisVoice>()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [slow, setSlow] = useState(false)

  function handleRefresh() {
    setPhrase(getNewPhrase(phrase))
    setSlow(false)
  }

  function handleCopy() {
    navigator.clipboard?.writeText(phrase).catch(console.error)
  }

  async function handleSpeak() {
    if (voice) {
      setIsSpeaking(true)
      await speak(phrase, voice, { slow })
      setIsSpeaking(false)
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
      {!!navigator.clipboard && <button onClick={handleCopy}>Copy</button>}

      <VoicePicker lang='ja' onChange={setVoice}>
        <button disabled={isSpeaking} onClick={handleSpeak}>
          Speak
        </button>
      </VoicePicker>
    </div>
  )
}
