import classNames from 'classnames'

import Ruby from '../../lib/ruby'
import './styles.scss'

export default function RubySpan(props: {
  content: Ruby
  lang?: string
  shy?: boolean
}) {
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
