import { useState } from 'react'

import { getNewPhrase } from '../../lib/nanji'
import { getVoices, speak } from '../../lib/speech'
import './App.css'

function App() {
  const [phrase, setPhrase] = useState(getNewPhrase)
  const [voices] = useState(() => getVoices('ja'))

  function handleRegenerate() {
    setPhrase(getNewPhrase(phrase))
  }

  function handleSpeak() {
    speak(phrase, voices[0])
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
      {voices.length > 0 && <button onClick={handleSpeak}>Speak</button>}
    </div>
  )
}

export default App
