import classNames from 'classnames'
import { useMemo, useState } from 'react'

import { copyTextToClipboard } from '../../lib/helpers'
import { getNewPhrase } from '../../lib/nanji'
import Ruby, { R, r } from '../../lib/ruby'
import Speaker from '../Speaker'
import './styles.scss'

const TITLE = R(
  r('今', 'ima'),
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
    copyTextToClipboard(phrase.toString()).catch(console.error)
  }

  return (
    <div className='App'>
      <h1 className='App-title' title='What time is it now?' lang='ja'>
        <RubySpan content={TITLE} shy />
      </h1>

      <p className='App-time' lang='ja'>
        <RubySpan content={phrase} />
      </p>

      <p>
        <button onClick={handleRefresh}>Refresh</button>
        <button disabled={!navigator.clipboard} onClick={handleCopy}>
          Copy
        </button>

        <Speaker lang='ja' text={text} />
      </p>
    </div>
  )
}

function RubySpan(props: { content: Ruby; shy?: boolean }) {
  const { shy = false } = props

  return (
    <span className={classNames('RubySpan', shy && 'RubySpan-shy')}>
      {props.content.map(({ base, text }, i) => (
        <ruby key={i} className={classNames(!text && 'RubySpan-notext')}>
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
