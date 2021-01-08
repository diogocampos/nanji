import { useMemo, useState } from 'react'

import { getNewPhrase } from '../../lib/nanji'
import Speaker from '../Speaker'
import './styles.css'

export default function App() {
  const [phrase, setPhrase] = useState(getNewPhrase)
  const text = useMemo(() => phrase.toString(), [phrase])

  console.log(phrase.toDebugString())

  function handleRefresh() {
    setPhrase(getNewPhrase(phrase))
  }

  function handleCopy() {
    navigator.clipboard?.writeText(text).catch(console.error)
  }

  return (
    <div className='App'>
      <h1 className='title' title='What time is it?' lang='ja'>
        何時ですか？
      </h1>

      <p className='time' lang='ja'>
        {text}
      </p>

      <button onClick={handleRefresh}>Refresh</button>
      {!!navigator.clipboard && <button onClick={handleCopy}>Copy</button>}

      <Speaker lang='ja' text={text} />
    </div>
  )
}
