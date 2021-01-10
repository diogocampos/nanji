import classNames from 'classnames'
import { useMemo, useState } from 'react'

import { getNewPhrase } from '../../lib/nanji'
import Ruby, { R, r } from '../../lib/ruby'
import Speaker from '../Speaker'
import './styles.css'

const TITLE = R(
  r('何', 'nan'),
  r('時', 'ji'),
  r('で', 'de'),
  r('す', 'su'),
  r('か', 'ka'),
  r('？', ''),
)

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
        <RubySpan content={TITLE} hover />
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

function RubySpan(props: { content: Ruby; hover?: boolean }) {
  const { hover = false } = props

  return (
    <span className={classNames('RubySpan', hover && 'hover')}>
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
