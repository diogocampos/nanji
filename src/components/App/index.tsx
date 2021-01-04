import { useState } from 'react'

import { generatePhrase } from '../../lib/nanji'
import './App.css'

function App() {
  const [phrase, setPhrase] = useState(generatePhrase)

  function handleRegenerate() {
    setPhrase(generatePhrase())
  }

  return (
    <div className='App'>
      <h1 className='title'>何時ですか？</h1>
      <p className='time'>{phrase}</p>
      <button onClick={handleRegenerate}>Regenerate</button>
    </div>
  )
}

export default App
