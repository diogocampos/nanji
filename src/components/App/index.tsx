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
      <h1 className='title' title='What time is it?' lang='ja'>
        何時ですか？
      </h1>
      <p className='time' lang='ja'>
        {phrase}
      </p>
      <button onClick={handleRegenerate}>Regenerate</button>
    </div>
  )
}

export default App
