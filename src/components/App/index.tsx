import classNames from 'classnames'
import { useMemo, useState } from 'react'

import { getNewPhrase } from '../../lib/nanji'
import Ruby from '../../lib/ruby'
import Speaker from '../Speaker'
import './styles.css'

export default function App() {
  const [phrase, setPhrase] = useState(getNewPhrase)
  const text = useMemo(() => phrase.toString(), [phrase])

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
        <RubySpan content={phrase} />
      </p>

      <button onClick={handleRefresh}>Refresh</button>
      <button disabled={!navigator.clipboard} onClick={handleCopy}>
        Copy
      </button>

      <Speaker lang='ja' text={text} />
    </div>
  )
}

function RubySpan(props: { content: Ruby }) {
  return (
    <span className='RubySpan'>
      {props.content.map(({ base, text }, i) => (
        <ruby key={i} className={classNames(!text && 'no-text')}>
          <span>{base}</span>
          {text && (
            <>
              <rp>(</rp>
              <rt>{text}</rt>
              <rp>)</rp>
            </>
          )}
        </ruby>
      ))}
    </span>
  )
}
