import { useCallback, useState } from 'react'

import { getNewPhrase } from '../../lib/nanji'
import { R, r } from '../../lib/ruby'
import Button, { CopyButton } from '../Button'
import RubySpan from '../RubySpan'
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

  const changePhrase = useCallback(() => {
    setPhrase(getNewPhrase(phrase))
  }, [phrase])

  return {
    state: { phrase },
    actions: { changePhrase },
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
        <Button onClick={actions.changePhrase}>Refresh</Button>
        <CopyButton content={state.phrase} />
        <Speaker lang='ja' content={state.phrase} />
      </div>
    </div>
  )
}
