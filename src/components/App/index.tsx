import { useState } from 'react'

import { getNewPhrase } from '../../lib/nanji'
import Speaker from '../Speaker'
import './styles.css'

export default function App() {
  const [phrase, setPhrase] = useState(getNewPhrase)

  function handleRefresh() {
    setPhrase(getNewPhrase(phrase))
  }

  function handleCopy() {
    navigator.clipboard?.writeText(phrase).catch(console.error)
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

      <Speaker lang='ja' text={phrase} />
    </div>
  )
}
