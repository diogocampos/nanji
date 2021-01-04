import { useState } from 'react'

import { generatePhrase } from '../../lib/nanji'
import './App.css'

function App() {
  const [phrase] = useState(generatePhrase)

  return (
    <div className='App'>
      <h1 className='title'>何時ですか？</h1>
      <p className='time'>{phrase}</p>
    </div>
  )
}

export default App
