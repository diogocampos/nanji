import classNames from 'classnames'
import { useCallback, useState } from 'react'

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

function useNanji() {
  const [phrase, setPhrase] = useState(getNewPhrase)

  const refreshPhrase = useCallback(() => {
    setPhrase(getNewPhrase(phrase))
  }, [phrase])

  const copyPhraseToClipboard = useCallback(() => {
    copyTextToClipboard(phrase.toString()).catch(console.error)
  }, [phrase])

  return {
    state: { phrase },
    actions: { refreshPhrase, copyPhraseToClipboard },
  }
}

export default function Nanji() {
  const { state, actions } = useNanji()

  return (
    <div className='Nanji'>
      <h1 className='Nanji-title' title='What time is it now?'>
        <RubySpan shy content={TITLE} lang='ja' />
      </h1>

      <p className='Nanji-time'>
        <RubySpan content={state.phrase} lang='ja' />
      </p>

      <div className='Nanji-toolbar'>
        <button onClick={actions.refreshPhrase}>Refresh</button>
        <CopyButton onClick={actions.copyPhraseToClipboard} />
        <Speaker lang='ja' content={state.phrase} />
      </div>
    </div>
  )
}

function RubySpan(props: { content: Ruby; lang?: string; shy?: boolean }) {
  const { shy = false } = props

  return (
    <span
      className={classNames('RubySpan', shy && 'RubySpan-shy')}
      lang={props.lang}
    >
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

function CopyButton(props: { onClick: () => void }) {
  return (
    <button disabled={!navigator.clipboard} onClick={props.onClick}>
      Copy
    </button>
  )
}
