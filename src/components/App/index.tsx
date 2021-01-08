import { Fragment, useMemo, useState } from 'react'

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
        <RubySequence content={phrase} />
      </p>

      <button onClick={handleRefresh}>Refresh</button>
      {!!navigator.clipboard && <button onClick={handleCopy}>Copy</button>}

      <Speaker lang='ja' text={text} />
    </div>
  )
}

function RubySequence(props: { content: Ruby }) {
  return (
    <ruby>
      {props.content.map(({ base, text }, i) => (
        <Fragment key={i}>
          {base}
          <rp>(</rp>
          <rt>{text}</rt>
          <rp>)</rp>
        </Fragment>
      ))}
    </ruby>
  )
}
