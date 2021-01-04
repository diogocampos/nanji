import { useState } from 'react'

import { getNewPhrase } from '../../lib/nanji'
import './App.css'

function App() {
  const [phrase, setPhrase] = useState(getNewPhrase)

  function handleRegenerate() {
    setPhrase(getNewPhrase(phrase))
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
